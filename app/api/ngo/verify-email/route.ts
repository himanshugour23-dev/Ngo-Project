import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(
      new URL("/ngo/verify-failed", req.url)
    );
  }
  const verification = await prisma.verification.findFirst({
    where: {
      value: token,
      identifier: {
        startsWith: "ngo:",
      },
    },
  });
  if (!verification) {
    return NextResponse.redirect(
      new URL("/ngo/verify-failed", req.url)
    );
  }
  if(verification.expiresAt < new Date()) {
    await prisma.verification.deleteMany({
      where: {
        id: verification.id,
      },
    });
    return NextResponse.redirect(
      new URL("/ngo/verify-failed", req.url)
    );
  }
  await prisma.ngo.update({
    where: {
      id : verification.identifier.split(":")[1],
    },
    data: {
      isEmailVerified: true,
    },
  });
  await prisma.verification.delete({
    where: {
      id: verification.id,
    },
  });
  return NextResponse.redirect(
    new URL("/ngo/email-verified", req.url)
  );
}

// import {prisma} from "@/lib/prisma"
// import { NextRequest , NextResponse} from "next/server";
// export async function GET(req: NextRequest){
//     try{
//         const {searchParams} = new URL(req.url);
//         const token = searchParams.get("token")
//         const newEmail = searchParams.get("email") ; 
//          if(!newEmail){return NextResponse.redirect(new URL("/profile?error=invalid_token",req.url));}
//          if (!token) {return NextResponse.redirect(new URL("/profile?error=invalid_token",req.url));}
//         const verification = await prisma.verification.findFirst({
//             where : {
//                 value : token,
//                 identifier : {
//                     startsWith : "change-email:",
//                 }
//             }
//         })
//         if(!verification){
//             return NextResponse.redirect(new URL("/profile?error=invalid_token",req.url));
//         }
//         if(verification.expiresAt < new Date()){
//               await prisma.verification.deleteMany({
//                 where : { 
//                     id : verification.id
//                 }
//               })
//             return NextResponse.redirect(new URL("/profile?error=expired_token",req.url));
//         }

//         const  parts = verification.identifier.split(":");
//         const userId = parts[1];
//         const verifiedEmail = parts[2];
//         await prisma.user.update({
//                where : {
//                 id : userId
//                },
//                data : { 
//                 email : verifiedEmail, 
//                 emailVerified : true
//                }
//         })
         
//         await prisma.session.deleteMany({
//             where: {
//                 userId,
//             },
//         });

//         await prisma.verification.delete({
//             where: {
//                 id: verification.id,
//             },
//         });
//             return NextResponse.redirect(new URL("/login",req.url));
//     }
//     catch(err){
//             console.log(err) ; 
//             return NextResponse.json({error : "Something went wrong "} , {status : 500})
//     }
// }