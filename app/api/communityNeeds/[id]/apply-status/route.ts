import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest,context: { params: Promise<{ id: string }> }) {
  try {
    const { id: needId } = await context.params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json( { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const assignment = await prisma.taskAssignment.findUnique({
      where: {
        needId_assignedToUserId: {
          needId,
          assignedToUserId: session.user.id,
        },
      },
      select: {
        approvalStatus: true,
      },
    });
    if (!assignment) {
      return NextResponse.json({
        alreadyApplied: false,
        approvalStatus: null,
        message: "You can apply for this community need.",
      });
    }
    if (assignment.approvalStatus === "pending") {
      return NextResponse.json({
        alreadyApplied: true,
        approvalStatus: "pending",
        message: "Already Applied. Please wait for NGO approval.",
      });
    }

    if (assignment.approvalStatus === "approved") {
      return NextResponse.json({
        alreadyApplied: true,
        approvalStatus: "approved",
        message: "You have already been approved for this community need.",
      });
    }

    if (assignment.approvalStatus === "rejected") {
      return NextResponse.json({
        alreadyApplied: true,
        approvalStatus: "rejected",
        message: "Your application was rejected. You cannot apply again.",
      });
    }

    return NextResponse.json({
      alreadyApplied: false,
      approvalStatus: null,
      message: "You can apply for this community need.",
    });

  } catch (err) {
    console.error("Apply Status Error:", err);
    return NextResponse.json({
        error: "Internal Server Error",
      },
      {status: 500});
  }
}