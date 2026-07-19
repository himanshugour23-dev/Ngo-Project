import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNgoFromToken } from "@/lib/ngo-auth";
import {sendVerificationEmail} from "@/lib/assignedAlertEmail";
export async function POST(req: NextRequest) {
  try {
    const ngo = await getNgoFromToken();

    if (!ngo) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userId, needId } = body;

    if (!userId || !needId) {
      return NextResponse.json({
          message: "userId and needId are required",
        },
        { status: 400 }
      );
    }

    const need = await prisma.communityNeeds.findUnique({
      where: {
        id: needId,
      },
    });

    if (!need) {
      return NextResponse.json(
        { message: "Community Need Not Found" },
        { status: 404 }
      );
    }
    if (need.ngoId !== ngo.ngoId) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    if (need.status === "resolved" || !need.isAcceptingInvites) {
      return NextResponse.json({
          message:
            "This community need is no longer accepting volunteers",
        },
        { status: 400 }
      );
    }

    if (need.voulenteersWorking >=need.maxVolunteers) {
      return NextResponse.json(
        {
          message:
            "Volunteer limit reached for this need",
        },
        { status: 400 }
      );
    }

    const volunteer =await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          isBanned: true,
        },
      });

    if (!volunteer) {
      return NextResponse.json(
        { message: "Volunteer not found" },
        { status: 404 }
      );
    }

    if (volunteer.isBanned) {
      return NextResponse.json(
        {
          message:
            "This volunteer is banned",
        },
        { status: 400 }
      );
    }

    if (!volunteer.isActive) {
      return NextResponse.json(
        {
          message:
            "This volunteer is no longer available",
        },
        { status: 400 }
      );
    }
    const activeAssignment =await prisma.taskAssignment.findFirst({
        where: {
          assignedToUserId: userId,
          approvalStatus: "approved",
        },
      });

    if (activeAssignment) {
      return NextResponse.json({
          message:
            "Volunteer is already working on another task",
        },
        { status: 400 }
      );
    }
    const existingAssignment =
      await prisma.taskAssignment.findUnique({
        where: {
          needId_assignedToUserId: {
            needId,
            assignedToUserId: userId,
          },
        },
      });

    if (existingAssignment) {
      return NextResponse.json(
        {
          message:
            "This volunteer already has an assignment for this need",
        },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.taskAssignment.create({
        data: {
          needId,
          assignedToUserId: userId,
          requestType: "ngo",
          approvalStatus: "approved",
          status: "inProgress",
        },
      }),

      prisma.communityNeeds.update({
        where: {
          id: needId,
        },
        data: {
          voulenteersWorking: {
            increment: 1,
          },
          status: "inProgress",
        },
      }),

      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          isActive: false,
        },
      }),
    ]);
    try {
      await sendVerificationEmail(
        volunteer.email,
        volunteer.name,
        need.ProblemDescription
      );
    } catch (emailError) {
      console.error(
        "Task assigned but email failed:",
        emailError
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Task assigned to volunteer successfully",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(
      "Error assigning volunteer:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Internal Server Error",
      },
      { status: 500 }
    );
  }
}