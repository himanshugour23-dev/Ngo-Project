import { NextRequest , NextResponse} from "next/server";
import { getNgoFromToken } from "@/lib/ngo-auth";
import {prisma} from "@/lib/prisma"

export async function POST(req:NextRequest , context : {params : Promise<{id:string ; assignmentId : string }>}){
        try{
                const {id , assignmentId} = await context.params;    
                const  body    = await req.json().catch(() => ({})); 
                const {rating}  = body  ;  
                if( rating !== undefined && (typeof rating !== "number" || rating < 1 || rating > 5)){
                     return NextResponse.json({message : " rating must be a number between 1 and 5"} , {status : 400})
                }
                const ngo  = await getNgoFromToken();
                if(!ngo){
                        return NextResponse.json({message : "Unauthorized"} , {status : 401})
                }
                const need= await prisma.communityNeeds.findUnique({
                        where : { 
                                id 
                         }
                })
                if(!need)return NextResponse.json({message : "Community Need Not Found"} , {status : 404})
                if(need.ngoId != ngo.ngoId){
                        return NextResponse.json({message : "Unauthorized"} , {status : 401})
                }
                const assignment = await prisma.taskAssignment.findUnique({
                        where :  { 
                                assignmentId , 
                        },
                        include : {
                                 need : true , 
                        }
                })
                if(!assignment)return NextResponse.json({message : "Assignment Not Found"} , {status : 404})
                if (assignment.need.id !== id) {
                    return NextResponse.json(
                        { message: "Assignment does not belong to this need" },
                        { status: 400 }
                    );
                }
                if(assignment.need.ngoId !== ngo.ngoId){
                        return NextResponse.json({message : "Unauthorized"} , {status : 403})
                }
                if(assignment.approvalStatus === "rejected"){
                        return NextResponse.json({message : "Assignment Already Rejected"} , {status : 400})
                }
                if(assignment.approvalStatus === "completed"){
                        return NextResponse.json({message : "Assignment Already Completed"} , {status : 400})
                }
                if(assignment.approvalStatus !== "approved"){
                       return NextResponse.json({message : "Only Approved Assignments Can Be Completed"} , {status : 400}) ; 
                }
            // Something new interective callback feature of prisma   detail me padh na 
            // tx is client instance bound to transaction   queries run sequentially  each is send to DB with same Transection 
                await prisma.$transaction(async (tx : any) => {
                        let avgRating = 0;
                        let ratingCount = 0;
                        if (rating !== undefined) {
                            const existingRating =
                            await tx.volunteerRating.findUnique({
                                where: {
                                assignmentId,
                                },
                            });
                            if (existingRating) {
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
                                        ngoId: ngo.ngoId,
                                        assignmentId,
                                        volunteerId:
                                        assignment.assignedToUserId,
                                        rating,
                                    },
                                });
                            }
                            const overallRating =
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
                            avgRating =
                            overallRating._avg.rating ?? 0;
                            ratingCount =
                            overallRating._count.rating;
                        }
                        await tx.taskAssignment.update({
                            where: {
                                assignmentId,
                            },
                            data: {
                                approvalStatus: "completed",
                                completedAt: new Date(),
                            },
                        });
                        if(need.voulenteersWorking > 0){
                        await tx.communityNeeds.update({
                            where: {
                                id,
                            },
                            data: {
                                voulenteersWorking: {
                                    decrement: 1,
                                },
                            },
                        });
                    }
                        await tx.user.update({
                            where: {
                                id: assignment.assignedToUserId,
                            },
                            data: {
                                taskCompleted: {
                                    increment: 1,
                                },
                            },
                        });
                        if (rating !== undefined) {

                            await tx.user.update({
                                where: {
                                    id: assignment.assignedToUserId,
                                },
                                data: {
                                    rating: avgRating,
                                    ratingCount,
                                },
                            });

                        }
                    });
                return NextResponse.json({message : "Assignment Completed Successfully"} , {status : 200})
        }
        catch(error){
                console.log(error,"Error in Completing Assignment"); 
                return NextResponse.json({message : "Internal Server Error"} , {status : 500})
        }
}