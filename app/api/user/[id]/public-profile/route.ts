import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNgoFromToken } from "@/lib/ngo-auth";

export async function GET(req: NextRequest,context: {params: Promise<{ id: string }>;}) {
  try {
    const { id: userId } = await context.params;
    const ngo = await getNgoFromToken();

    if (!ngo) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        city: true,
        skills: true,
        preferredCategories: true,
        isActive: true,
        taskCompleted: true,
        rating: true,
        ratingCount: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Error fetching volunteer public profile:",
      error
    );
    return NextResponse.json({
        message: "Something went wrong while fetching user profile",
      },
      {status: 500,}
    );
  }
}