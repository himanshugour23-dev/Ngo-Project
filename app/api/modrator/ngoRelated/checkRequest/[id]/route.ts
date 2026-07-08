import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {authorizeModerator} from "@/lib/authModerator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authorizeModerator();
    if (authResult.error) return authResult.error;

    const { id } = await params;

    const ngo = await prisma.ngo.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        ngoName: true,
        email: true,
        type: true,
        city: true,
        motto: true,
        Address: true,
        latitude: true,
        longitude: true,
        registrationCertificate: true,
        eightyGNumber: true,
        twelveGNumber: true,
        yearOfEstablishment: true,
        isEmailVerified: true,
        isVerified: true,
        createdAt: true,
      },
    });
    if (!ngo) {
      return NextResponse.json({
          success: false,
          message: "NGO not found",
        },
        {status: 404,}
      );
    }
    return NextResponse.json({
        success: true,
        data: ngo,
      },
      {status: 200}
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({
        success: false,
        message: "Internal Server Error",
      },
      {status: 500}
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authorizeModerator();
    if (authResult.error) return authResult.error;
    const { id } = await params;
    const body = await req.json();
    const { isVerified } = body;
    if (typeof isVerified !== "boolean") {
      return NextResponse.json({
          success: false,
          message: "isVerified must be a boolean (true or false)",
        },
        { status: 400 }
      );
    }
    const ngo = await prisma.ngo.findUnique({
      where: { id },
      select: { id: true, isVerified: true },
    });
    if (!ngo) {
      return NextResponse.json({
          success: false,
          message: "NGO not found",
        },
        { status: 404 }
      );
    }

    if (ngo.isVerified === isVerified) {
      return NextResponse.json({
          success: false,
          message: `NGO is already ${isVerified ? "verified" : "unverified"}`,
        },
        { status: 400 }
      );
    }

    const updatedNgo = await prisma.ngo.update({
      where: { id },
      data: { isVerified },
    });

    return NextResponse.json({
        success: true,
        message: `NGO ${isVerified ? "verified" : "unverified"} successfully`,
        data: updatedNgo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}


