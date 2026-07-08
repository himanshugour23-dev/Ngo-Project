import {prisma} from "@/lib/prisma"
import {getNgoFromToken } from "@/lib/ngo-auth"
import { NextRequest , NextResponse} from "next/server";
export async function GET(req: NextRequest,context: {params: Promise<{id: string;}>;}){
        try{
           const {id: needId} = await context.params ; 
            const ngo = await getNgoFromToken() ;
            if(!ngo) return NextResponse.json({error: "Unauthorized"}, {status: 401});
            const ngoId= (ngo as any).ngoId ;
            const need = await prisma.communityNeeds.findUnique({
                where : {
                    id : needId  , 
                }
            }) ; 
            if(!need) return NextResponse.json( {message : "needId Not Found"}, { status : 404 }) ; 
            if(ngo.ngoId != need.ngoId) return NextResponse.json({error: "Unauthorized"}, {status: 401});
            const requests = await prisma.taskAssignment.findMany({
                    where : {
                        needId,
                        approvalStatus : "pending"
                    },
                    orderBy : {
                        createdAt : "desc" 
                    },
                    include : { 
                        user : {
                            select : { 
                                id : true , 
                                name : true , 
                                email : true, 
                                city : true , 
                                skills : true , 
                                rating : true  , 
                                taskCompleted : true , 
                                preferredCategories : true
                            }
                        }
                    }
            }); 
            return NextResponse.json({
                success : true , 
                count : requests.length ,
                requests 
            }) ; 
        }
        catch(err){
                console.log(err,"unable to fetch Requests") ; 
                return NextResponse.json({
                    message : "failed to fetch requests"
                },
            {
                status : 500
            })
        }
}