import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/ngoVerification";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    if (!email) {
      return NextResponse.json(
        {error: "Email is required"},
        {status: 400}
      );
    }

    const ngo = await prisma.ngo.findUnique({
      where: {
        email,
      },
    });

    if (!ngo) {
      return NextResponse.json(
        {
          error: "NGO not found",
        },
        {
          status: 404,
        }
      );
    }

    if (ngo.isVerified) {
      return NextResponse.json(
        {
          error: "Email already verified",
        },
        {
          status: 400,
        }
      );
    }
    const token = crypto.randomBytes(32).toString("hex");
    //         await prisma.$transaction([
//             prisma.verification.deleteMany({
//                 where: {
//                 identifier: `change-email:${session.user.id}`,
//                 },
//             }),
//             prisma.verification.create({
//                 data: {
//                 id: crypto.randomUUID(),
//                 identifier: `change-email:${session.user.id}:${newEmail}`,
//                 value: token,
//                 expiresAt,
//                 },
//                  }),
//             ]);

        await prisma.$transaction([
             prisma.verification.deleteMany({
                 where :{
                     identifier : `ngo:${ngo.id}`
                 }
             }),
             prisma.verification.create({
                 data: {
                 id: crypto.randomUUID(),
                 // NGO identifier
                 identifier: `ngo:${ngo.id}`,
                 value: token,
                 expiresAt: new Date(
                   Date.now() +
                     1000 * 60 * 60 * 24
                      ), // 24 hours
                    },
                 }),
        ])

    const origin = new URL(req.url).origin ; 

    const verificationUrl =
      `${origin}/api/ngo/verify-email?token=${token}`;

    await sendVerificationEmail(
      ngo.email,
      ngo.ngoName,
      verificationUrl
    );

    return NextResponse.json({
      success: true,
      message:
        "Verification email sent successfully",
    });
  } catch (error) {
    console.error(
      "NGO verification email error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to send verification email",
      },
      {
        status: 500,
      }
    );
  }
}



// export async function POST(req: NextRequest){
//     try{
//         await prisma.$transaction([
//             prisma.verification.deleteMany({
//                 where: {
//                 identifier: `change-email:${session.user.id}`,
//                 },
//             }),
//             prisma.verification.create({
//                 data: {
//                 id: crypto.randomUUID(),
//                 identifier: `change-email:${session.user.id}:${newEmail}`,
//                 value: token,
//                 expiresAt,
//                 },
//                  }),
//             ]);
//         const origin = new URL(req.url).origin ; 
//         const verificationUrl = `${origin}/api/user/change-email/verify?token=${token}&email=${newEmail}`;
//         await changeEmail (
//             newEmail,
//             session.user.name,
//             verificationUrl
//         );
//         return NextResponse.json({message : "Email change request sent"} , {status : 200});
//     }
//     catch(error){
//             console.log(error)
//             return NextResponse.json({error : "Something went wrong"} , {status : 500});
//     }
// }