import {changeEmail} from "@/lib/changeEmail";
import {NextResponse,NextRequest} from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import z from "zod";
import {prisma} from "@/lib/prisma";
import crypto from "crypto"; 
const newEmailschema = z.object({
  newEmail: z.email(),
});

export async function POST(req: NextRequest){
    try{
        const session = await auth.api.getSession({headers : await headers()});
        if(!session) return NextResponse.json({error : "Unauthorized"} , {status : 401});
        const body = await req.json(); 
        const { newEmail } = newEmailschema.parse(body);
        const existing  = await prisma.user.findUnique({
            where :{
                email : newEmail 
            }
        })
        
        if(existing){
            return NextResponse.json({error : "Email already exists"} , {status : 400});
        }
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now()+60*60*1000)  ; 
        await prisma.$transaction([
            prisma.verification.deleteMany({
                where: {
                identifier: `change-email:${session.user.id}`,
                },
            }),
            prisma.verification.create({
                data: {
                id: crypto.randomUUID(),
                identifier: `change-email:${session.user.id}:${newEmail}`,
                value: token,
                expiresAt,
                },
                 }),
            ]);
        const origin = new URL(req.url).origin ; 
        const verificationUrl = `${origin}/api/user/change-email/verify?token=${token}&email=${newEmail}`;
        await changeEmail (
            newEmail,
            session.user.name,
            verificationUrl
        );
        return NextResponse.json({message : "Email change request sent"} , {status : 200});
    }
    catch(error){
            console.log(error)
            return NextResponse.json({error : "Something went wrong"} , {status : 500});
    }
}