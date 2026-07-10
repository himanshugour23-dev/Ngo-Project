import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.redirect(
        new URL("/ngo-login?error=invalid_token", req.url)
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
        new URL("/ngo-login?error=invalid_token", req.url)
      );
    }

    if (verification.expiresAt < new Date()) {
      await prisma.verification.delete({
        where: {
          id: verification.id,
        },
      });
      return NextResponse.redirect(
        new URL("/ngo-login?error=token_expired", req.url)
      );
    }
    const ngoId = verification.identifier.split(":")[1];
    const ngo = await prisma.ngo.findUnique({
      where: {
        id: ngoId,
      },
    });
    if (!ngo) {
      await prisma.verification.delete({
        where: {
          id: verification.id,
        },
      });
      return NextResponse.redirect(
        new URL("/ngo-login?error=user_not_found", req.url)
      );
    }
    if (ngo.isEmailVerified) {
      await prisma.verification.delete({
        where: {
          id: verification.id,
        },
      });
      return NextResponse.redirect(
        new URL("/ngo-login?message=already_verified", req.url)
      );
    }
    await prisma.ngo.update({
      where: {
        id: ngoId,
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
      new URL("/ngo-login?message=email_verified", req.url)
    );
  } catch (error) {
    console.error("NGO Email Verification Error:", error);
    return NextResponse.redirect(
      new URL("/ngo-login?error=server_error", req.url)
    );
  }
}