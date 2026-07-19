import { getNgoFromToken } from "@/lib/ngo-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const ngo = await getNgoFromToken();
    if (!ngo) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const usersActive = await prisma.user.findMany({
      where: {
        isActive: true,
        isBanned: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        city: true,
        bio: true,
        skills: true,
        preferredCategories: true,
        rating: true,
        ratingCount: true,
        taskCompleted: true,
      },
      orderBy: {
        rating: "desc",
      },
    });
    return NextResponse.json({
      success: true,
      count: usersActive.length,
      usersActive,
    });
  } catch (error) {
    console.log(
      error,
      "Error while fetching active volunteers"
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}