import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";
import { NextResponse,NextRequest} from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest){
    try {
        const origin = new URL(req.url).origin;
        const {email} = await req.json();
        if(!email){
            return NextResponse.json({error: "Email required"}, {status: 400});
        }
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
            select : {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
            }
        });
        if(!user){
            return NextResponse.json({error: "User not found"}, {status: 404},);
        }
        if(user.emailVerified){
            return NextResponse.json({error: "Email already verified"}, {status: 400},);
        }

        const token  = crypto.randomBytes(32).toString("hex");
        const expiresAt =  new Date(Date.now() + 1*60*60*1000);
           await prisma.verification.deleteMany({
            where: { identifier: `email-verification:${email}` },
            });
       await prisma.verification.create({
      data: {
        id: crypto.randomUUID(),
        identifier: `email-verification:${email}`,
        value: token,
        expiresAt,
      },
    });
        const verificationUrl = `${origin}/api/user/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
           await sendVerificationEmail(
            user.email,
            user.name || "Volunteer",
            verificationUrl
            );
             return NextResponse.json({ success: true });
    }  catch (err) {
    console.error("[POST /api/user/send-verification]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
 