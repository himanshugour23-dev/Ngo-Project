import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  try {

    const twoDaysAgo =
      new Date(
        Date.now() -
        2 * 24 * 60 * 60 * 1000
      );

    const result =
      await prisma.taskAssignment.updateMany({

        where: {

          approvalStatus:
            "pending",

          createdAt: {
            lte: twoDaysAgo,
          },
        },

        data: {
          approvalStatus: "rejected",
        },
      });

    return NextResponse.json({
      success: true,
      updated:
        result.count,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Cron failed",
      },
      {
        status: 500,
      }
    );
  }
}