import {prisma} from "@/lib/prisma";
import {getNgoFromToken} from "@/lib/ngo-auth";
import { NextRequest , NextResponse} from "next/server";

export async function POST(req:NextRequest , context : {params : Promise<{id:string}>}){
     try {
        const {id} = await context.params 
        const ngo = await getNgoFromToken();
        if(!ngo)  return NextResponse.json({message : "Unauthorized"} , {status : 401}) 
        const need = await prisma.communityNeeds.findUnique({
            where : {
                id , 
            }    
        })
        if(!need) return NextResponse.json({message : "Community Need Not Found"} , {status : 404})
        if(need.ngoId !== ngo.ngoId){
            return NextResponse.json({message : "Forbidden"} , {status : 401})
        }
    await prisma.$transaction(async (tx:any) => {
        const approvedAssignments =
            await tx.taskAssignment.findMany({
                where: {
                    needId: id,
                    approvalStatus: "approved",
                },
            });
                await tx.communityNeeds.update({
                    where: {
                        id,
                    },
                    data: {
                        status: "resolved",
                        isAcceptingInvites: false,
                        voulenteersWorking: 0,
                    },
                });
                await tx.taskAssignment.updateMany({
                    where: {
                        needId: id,
                        approvalStatus: "approved",
                    },
                    data: {
                        approvalStatus: "completed",
                        completedAt: new Date(),
                    },
                });
                for (const assignment of approvedAssignments) {
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
                }
            });
        return NextResponse.json({message : "Community Need Resolved Successfully"} , {status : 200})
     } catch (error) {
        console.log(error,"error in resolving particular communityNeed")
        return NextResponse.json({message : "Internal Server Error"} , {status : 500})
     }
}