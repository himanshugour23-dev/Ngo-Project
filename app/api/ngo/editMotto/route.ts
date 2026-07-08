import { NextRequest, NextResponse } from "next/server";
import { getNgoFromToken } from "@/lib/ngo-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
const mottoChangeSchema = z.object({
  motto: z.string().trim().min(1, "Motto cannot be empty").max(300, "Motto cannot exceed 300 characters"),
});

export async function PATCH(req: NextRequest) {
  try {
    const ngo = await getNgoFromToken();
    if (!ngo) {
      return NextResponse.json(
        {success: false,message: "Unauthorized",},
        { status: 401,}
      );
    }
    const body = await req.json();
    const { motto } = mottoChangeSchema.parse(body);
    const updatedNgo = await prisma.ngo.update({
      where: {
        id: ngo.ngoId,
      },
      data: {
        motto,
      },
      select: {
        motto: true,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "Motto updated successfully",
        motto: updatedNgo.motto,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.issues[0].message,
        },
        {
          status: 400,
        }
      );
    }

    console.error("Update Motto Error:", error);

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