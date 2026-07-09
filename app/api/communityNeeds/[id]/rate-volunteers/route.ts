import {NextResponse, NextRequest} from 'next/server';
import {getNgoFromToken} from '@/lib/ngo-auth';
import {prisma} from '@/lib/prisma';
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest, context: {params: Promise<{id: string}>}) {
    try{
        const  {id : needId} = await context.params;
        const ngo = await getNgoFromToken() ; 
        if(!ngo) return NextResponse.json({error: "Unauthorized"}, {status: 401});
        const need = await prisma.communityNeeds.findUnique({
            where  : {
                id : needId
            }
        })
        if(!need) return NextResponse.json({message : "Need Not Found"} , {status : 404})
        if(need.ngoId !== ngo.ngoId){
            return NextResponse.json({message : "Unauthorized"} , {status : 401})
        }
        const voulenteers = await prisma.taskAssignment.findMany({
            where : {
                id : needId , 
                approvalStatus : "completed" ,
            },
            include : {
                user  :{ 
                    select : {
                        id : true , 
                        name : true , 
                        email : true ,
                        rating : true , 
                        ratingCount : true , 
                        image : true,
                        taskCompleted : true ,  
                    },
                },
                ratingFromAssignment : {
                    select : {
                        id : true , 
                        rating : true
                    }
                }
            }
        })
        return NextResponse.json({
            success : true , 
            voulenteers
        })
    }catch(error){
        console.log(error,"error in rating voulenteers")
        return NextResponse.json({error : "Something went wrong"} , {status : 500})
    }
}

export async function POST(req: NextRequest,context: {params: Promise<{id: string;}>;}) {
  try {
    const { id } = await context.params;
    const body =await req.json();
    const ratings =body.ratings ?? [];
    const ngo =await getNgoFromToken();
    if (!ngo) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const need =
      await prisma.communityNeeds.findUnique({
        where: {
          id,
        },
      });

    if (!need) {
      return NextResponse.json(
        {
          message:
            "Community Need Not Found",
        },
        {
          status: 404,
        }
      );
    }

    if (need.ngoId !== ngo.ngoId) {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }
    await prisma.$transaction(
      async (tx : Prisma.TransactionClient ) => {
        for (const item of ratings) {
          const {assignmentId,rating} = item;
          if ( rating !== undefined && (typeof rating !=="number" ||rating < 1 ||rating > 5)) {
            continue;
          }
          const assignment =
            await tx.taskAssignment.findUnique({
              where: {
                assignmentId,
              },
            });
          if (!assignment ||assignment.needId !== id) {
            continue;
          }
          const existing =
            await tx.volunteerRating.findUnique({
              where: {
                assignmentId,
              },
            });
          if (existing) {
            await tx.volunteerRating.update({
              where: {
                assignmentId,
              },
              data: {
                rating,
              },
            });
          } else {
            await tx.volunteerRating.create({
              data: {
                ngoId:
                ngo.ngoId,
                assignmentId,
                volunteerId:
                assignment.assignedToUserId,
                rating,
              },
            });
          }
          const stats =
            await tx.volunteerRating.aggregate({
              where: {
                volunteerId:
                  assignment.assignedToUserId,
              },
              _avg: {
                rating: true,
              },
              _count: {
                rating: true,
              },
            });

          await tx.user.update({
            where: {
              id:
                assignment.assignedToUserId,
            },
            data: {
              rating:
                stats._avg.rating ??
                0,
              ratingCount:
                stats._count.rating,
            },
          });
        }
      }
    );
    return NextResponse.json({
      success: true,
      message:
        "Ratings submitted successfully",
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json({
        message:
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}