import { headers } from "next/headers";
import {auth} from "@/lib/auth";
import { NextResponse , NextRequest} from "next/server";
import { prisma } from "@/lib/prisma";

export async function authorizeModerator() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return {
      error: NextResponse.json({
          success: false,
          message: "Unauthorized",
        },
        {status: 401}
      ),
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
      isBanned: true,
    },
  });
  if (!user) {
    return {
      error: NextResponse.json({
          success: false,
          message: "User not found",
        },
        { status: 404,}
      ),
    };
  }

  if (user.isBanned) {
    return {
      error: NextResponse.json({
          success: false,
          message: "Your account has been banned",
        },
        {status: 403,}
      ),
    };
  }

  if (user.role !== "moderator") {
    return {
      error: NextResponse.json({
          success: false,
          message: "Forbidden",
        },
        { status: 403}
      ),
    };
  }

  return {};
}

