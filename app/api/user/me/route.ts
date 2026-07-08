import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session =
      await auth.api.getSession({
        headers: await headers(),
      });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      rating: user.rating,
      ratingCount: user.ratingCount,
      skills: user.skills ?? [],
      preferredCategories:
        user.preferredCategories ?? [],
      bio: user.bio,
      isActive: user.isActive,
      taskCompleted:
        user.taskCompleted,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Failed to fetch profile",
      },
      {
        status: 500,
      }
    );
  }
}