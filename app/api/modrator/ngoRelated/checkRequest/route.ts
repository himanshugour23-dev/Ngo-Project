import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({
          success: false,
          message: "Unauthorized",
        },
        {status: 401,})
    }
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id},
      select: {
        role: true,
        isBanned: true },
    });
    if (!user) {
      return NextResponse.json({
          success: false,
          message: "User not found",
        },
        {status: 404}
      );
    }
    if (user.isBanned) {
      return NextResponse.json({
          success: false,
          message: "Your account has been banned",
        },
        {
          status: 403,
        }
      );
    }

    if (user.role !== "moderator") {
      return NextResponse.json({
          success: false,
          message: "Forbidden"
        },
        {status: 403}
      );
    }
    const data = await prisma.ngo.findMany({
        where: {
                isVerified: false,
            },
  select: {
    id: true,
    ngoName: true,
    email: true,
    type: true,
    city: true,
    motto: true,
    Address: true,
    registrationCertificate: true,
    eightyGNumber: true,
    twelveGNumber: true,
    yearOfEstablishment: true,
    isEmailVerified: true,
    isVerified: true,
    createdAt: true,
  },
});
    return NextResponse.json({
        success: true,
        data 
    },
    {status : 200}
    )
  } catch (error) {
    console.error("Moderator Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}