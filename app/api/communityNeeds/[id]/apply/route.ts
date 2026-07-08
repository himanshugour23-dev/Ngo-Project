import {prisma} from "@/lib/prisma";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import { NextResponse ,NextRequest } from "next/server";
import { z } from "zod";

const applySchema = z.object({
  needId: z.string(),
});

export async function POST(req : NextRequest){
    try{
        const session = await auth.api.getSession({
            headers : await headers(),
        });
        console.log("sesson found")
        if(!session) return NextResponse.json({error: "Unauthorized"}, {status: 401});
        if(session.user.emailVerified === false) return NextResponse.json({error: "Email not verified"}, {status: 401});
        if ((session.user as { isBanned?: boolean }).isBanned) return NextResponse.json({error: "You are banned"}, {status: 401});
        const body = await req.json();
        console.log("Body Found", body)
        const validatedData = applySchema.parse(body);
        console.log("Validated Data", validatedData)
        const need = await prisma.communityNeeds.findUnique({
            where : {
                id : validatedData.needId, 
            }
        }) ; 
        if(!need || need.isAcceptingInvites === false || need.status === "resolved")return NextResponse.json({error: "CommintNyeed does Not exists or either Resolved or may be the Ngo is Not accepting invites"}, {status: 404});
        if(need.voulenteersWorking >= need.maxVolunteers) return NextResponse.json({error: "Maximum Volunteers Reached"}, {status: 400});
        const existingUser = await prisma.taskAssignment.findFirst({
            where : {
                assignedToUserId  : session.user.id ,
                    approvalStatus : {
                    in : [ 
                        "pending" , 
                        "approved", 
                    ],
                },
            },
        }) ;       
        console.log("Existing User Check", existingUser)
        if(existingUser){
            return NextResponse.json({error: "You are already assigned to a task and or may be applied once wait for 2 days if no approval comes or Complete the Task you've been provided first"}, {status: 400});
        }
        console.log("Checking if user has already applied for this need")
        const alreadyApplied = await prisma.taskAssignment.findUnique({
        where: {
          needId_assignedToUserId: {
            needId : validatedData.needId ,
            assignedToUserId: session.user.id,
          },
        },
      });
      if(alreadyApplied)return NextResponse.json(
        {message : "You have already applied for this need"},
        {status : 400}
      ) ; 
      console.log("Creating Assignment")
    const assignment = await prisma.taskAssignment.create({
        data : {
            needId : validatedData.needId,
            assignedToUserId : session.user.id,
            requestType : "volunteer" , 
            approvalStatus : "pending",
            status : "pending" 
            },
    }) ; 
    console.log("Assignment Created Successfully", assignment) ;
    return NextResponse.json({message : "Applied Successfully"});
    }
    catch (err) {
    console.error(err);
    return NextResponse.json({
            error: err instanceof Error ? err.message : "Unknown Error",
        },
        { status: 500,});
}
}
