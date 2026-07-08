import { NextRequest, NextResponse } from "next/server";
import {
  generateAccessToken,
  verifyRefreshToken,
} from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("ngo_refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          message: "Refresh token missing",
        },
        {
          status: 401,
        }
      );
    }

    const decoded = verifyRefreshToken(refreshToken) as {
      ngoId: string;
    };

    const newAccessToken = generateAccessToken(decoded.ngoId);

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("ngo_access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15,
      path: "/",
    });

    return response;
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Invalid refresh token",
      },
      {
        status: 401,
      }
    );
  }
}