import {getNgoFromToken} from "@/lib/ngo-auth";
import {prisma} from "@/lib/prisma"
import { NextRequest , NextResponse} from "next/server";

export async function GET(req:NextRequest , context : {params : Promise<{id:string}>}){
    try{
        const {id} = await context.params;
        const ngo = await getNgoFromToken();
        if(!ngo)return NextResponse.json({message : "Unauthorized"} , {status : 401})
        const need  = await prisma.communityNeeds.findUnique({
            where : {
                id
            },
            select : {
                ngoId : true ,
                ProblemDescription : true 
            }
        })
        if(!need)return NextResponse.json({message : "Community Need Not Found"} , {status : 404})
        if(need.ngoId !== ngo.ngoId){
            return NextResponse.json({message : "Unauthorized"} , {status : 401})
        }
        const voulenteers = await prisma.taskAssignment.findMany({
            where : {
                 needId : id , 
                 approvalStatus : "completed"
            },
            include : { 
                user :  {
                    select : {
                        id : true ,
                        name: true , 
                        email : true ,
                        image : true ,
                        city : true , 
                        skills : true , 
                        taskCompleted : true,
                        rating : true ,
                        ratingCount : true ,
                    }
                }
            }
        })
           return NextResponse.json({success: true,
          count:
          voulenteers.length,
          voulenteers,
        });
    }
    catch(error){
        console.log(error) 
                return NextResponse.json({message : "Internal Server Error"} , {status : 500}) 
    }
}