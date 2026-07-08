import {prisma} from "@/lib/prisma"
import { NextRequest , NextResponse} from "next/server";
export async function GET(req: NextRequest){
    try{
        const {searchParams} = new URL(req.url);
        const token = searchParams.get("token")
        const newEmail = searchParams.get("email") ; 
         if(!newEmail){return NextResponse.redirect(new URL("/profile?error=invalid_token",req.url));}
         if (!token) {return NextResponse.redirect(new URL("/profile?error=invalid_token",req.url));}
        const verification = await prisma.verification.findFirst({
            where : {
                value : token,
                identifier : {
                    startsWith : "change-email:",
                }
            }
        })
        if(!verification){
            return NextResponse.redirect(new URL("/profile?error=invalid_token",req.url));
        }
        if(verification.expiresAt < new Date()){
              await prisma.verification.deleteMany({
                where : { 
                    id : verification.id
                }
              })
            return NextResponse.redirect(new URL("/profile?error=expired_token",req.url));
        }

        const  parts = verification.identifier.split(":");
        const userId = parts[1];
        const verifiedEmail = parts[2];
        await prisma.user.update({
               where : {
                id : userId
               },
               data : { 
                email : verifiedEmail, 
                emailVerified : true
               }
        })
         
        await prisma.session.deleteMany({
            where: {
                userId,
            },
        });

        await prisma.verification.delete({
            where: {
                id: verification.id,
            },
        });
            return NextResponse.redirect(new URL("/login",req.url));
    }
    catch(err){
            console.log(err) ; 
            return NextResponse.json({error : "Something went wrong "} , {status : 500})
    }
}