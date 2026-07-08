import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
            const origin = new URL(req.url).origin;
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    // Basic validation
    if (!token || !email) {
      return NextResponse.redirect(
        `${origin}/login?error=invalid_link`
      );
    }

    const verification = await prisma.verification.findFirst({
      where: {
        identifier: `email-verification:${email}`,
        value: token,
      },
    });


    if (!verification) {
      return NextResponse.redirect(
        `${origin}/login?error=invalid_token`
      );
    }

    if (verification.expiresAt < new Date()) {
      await prisma.verification.delete({
        where: { id: verification.id },
      });

      return NextResponse.redirect(
        `${origin}/login?error=token_expired`
      );
    }


    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, emailVerified: true },
    });

    if (!user) {
      return NextResponse.redirect(
        `${origin}/login?error=user_not_found`
      );
    }

    if (user.emailVerified) {
      await prisma.verification.delete({
        where: { id: verification.id },
      });

      return NextResponse.redirect(
        `${origin}/login?message=already_verified`
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      }),
      prisma.verification.delete({
        where: { id: verification.id },
      }),
    ]);

    // Redirect to login with success message
    return NextResponse.redirect(
      `${origin}/login?message=email_verified`
    );
  } catch (err) {
    console.error("[GET /api/user/verify-email]", err);
    return NextResponse.redirect(
      `${origin}/login?error=server_error`
    );
  }
}