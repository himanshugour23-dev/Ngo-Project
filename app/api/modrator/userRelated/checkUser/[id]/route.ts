import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeModerator } from "@/lib/authModerator";

export async function GET(req: NextRequest,{ params }: { params: Promise<{ id: string }> }){
  try {
    const authResult = await authorizeModerator();
    if (authResult.error) return authResult.error;
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBanned: true,
        rating: true, 
        createdAt: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    if (user.role !== "volunteer") {
      return NextResponse.json(
        { success: false, message: "Only volunteers can be viewed from this route." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: true, data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Volunteer Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest,{ params }: { params: Promise<{ id: string }> }){
  try {
    const authResult = await authorizeModerator();
    if (authResult.error) return authResult.error;
    const { id } = await params;
    const body = await req.json();
    const { isBanned } = body;
    if (typeof isBanned !== "boolean") {
      return NextResponse.json(
        { success: false, message: "isBanned must be a boolean (true or false)" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, isBanned: true },
    });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Volunteer not found" },
        { status: 404 }
      );
    }
    if (user.role !== "volunteer") {
      return NextResponse.json(
        { success: false, message: "Only volunteers can be banned from this route." },
        { status: 400 }
      );
    }
    if (user.isBanned === isBanned) {
      return NextResponse.json(
        {
          success: false,
          message: `Volunteer is already ${isBanned ? "banned" : "unbanned"}.`,
        },
        { status: 400 }
      );
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isBanned },
    });
    return NextResponse.json(
      {
        success: true,
        message: `Volunteer ${isBanned ? "banned" : "unbanned"} successfully.`,
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ban Volunteer Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}