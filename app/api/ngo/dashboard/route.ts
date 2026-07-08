import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNgoFromToken } from "@/lib/ngo-auth";

export async function GET() {
  try {
    const ngo = await getNgoFromToken();
    if (!ngo) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const ngoId = (ngo as any).ngoId;
    const [activeNeeds,completedNeeds,pendingRequests,volunteerData,
    ] = await Promise.all([
      prisma.communityNeeds.count({
        where: {
          ngoId,
          status: {
            not: "resolved",
          },
        },
      }),
      prisma.communityNeeds.count({
        where: {
          ngoId,
          status: "resolved",
        },
      }),
      prisma.taskAssignment.count({
        where: {
          approvalStatus: "pending",
          need: {
            ngoId,
          },
        },
      }),
      prisma.communityNeeds.aggregate({
        where: {ngoId,
          status: {
            not: "resolved",
          },
        },
        _sum: {
          voulenteersWorking: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      dashboard: {
        activeNeeds,
        volunteersWorking:
          volunteerData._sum
            .voulenteersWorking ?? 0,
        completedNeeds,
        pendingRequests,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {message:"Failed to load dashboard.",},
      {status: 500,}
    );
  }
}