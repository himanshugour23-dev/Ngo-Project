import {NextRequest, NextResponse} from "next/server";
import { getNgoFromToken } from "@/lib/ngo-auth";
import {prisma} from "@/lib/prisma"

export async function POST(req : NextRequest, context : {params : Promise<{id:string ; assignmentId : string}>}){
    try{
        const {id,assignmentId} = await context.params ; 
        const ngo = await getNgoFromToken() ; 
        if(!ngo)return NextResponse.json({message : "Unauthorized"} , {status : 401})
        const need = await prisma.communityNeeds.findUnique({
            where : {
                 id
            }
        })
        if(!need)return NextResponse.json({message : "Community Need Not Found"} , {status : 404})
        if(need.ngoId !== ngo.ngoId) return NextResponse.json({message : "communityNeed not belong to your NGO"} , {status : 401})
        const assignment = await prisma.taskAssignment.findUnique({
                    where : {
                            assignmentId ,
                    },
                    include : {
                            need : true ,
                    }
                })
        if(!assignment)return NextResponse.json({message : "Assignment Not Found"} , {status : 404})
        if(assignment.need.id !== id){
            return NextResponse.json({message : "Assignment does not belong to this need"} , {status : 400})
        }
        if(assignment.need.ngoId !== ngo.ngoId){ 
            return NextResponse.json({message : "need belong to other ngo"} , {status : 403})
        }
        if (assignment.need.voulenteersWorking >=assignment.need.maxVolunteers) {
            return NextResponse.json({
                error: "Volunteer limit reached",
                },{
                status: 400,
                });
            }
         
        if(assignment.approvalStatus !== "pending") return NextResponse.json({message : "Alerady processed this req "} , {status : 400})
            await prisma.$transaction([
            prisma.taskAssignment.update({
                where: {
                assignmentId,
                },
                data: {
                approvalStatus:
                    "approved",
                },
            }),
            prisma.communityNeeds.update({
                where: {
                    id,
                },
                data: {
                  voulenteersWorking: {
                      increment: 1,
                  },
                  },
               }),
            ]);
        return NextResponse.json({message : "voulenteer Approved Successfully"} , {status : 200})
        }
       catch(error){
        console.log(error,"Error in Approving Assignment");
        return NextResponse.json({message : "Internal Server Error"} , {status : 500})
    }   
    }
