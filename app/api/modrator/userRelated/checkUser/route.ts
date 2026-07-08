import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeModerator } from "@/lib/authModerator";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeModerator();
    if (authResult.error) return authResult.error;

    const { searchParams } = new URL(req.url);
    const showBanned = searchParams.get("banned"); 
    const users = await prisma.user.findMany({
      where: {
        role: "volunteer",
        ...(showBanned !== null ? { isBanned: showBanned === "true" } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        isBanned: true,
        rating: true,
        createdAt: true,
      },
      orderBy: { rating: "asc" }, 
    });
    return NextResponse.json(
      { success: true, data: users },
      { status: 200 }
    );
  } catch (error) {
    console.error("List Volunteers Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}