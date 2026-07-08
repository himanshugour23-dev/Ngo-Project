import { prisma } from "@/lib/prisma";
import {NextRequest,NextResponse,} from "next/server";
export async function GET(req: NextRequest,
  context: {params: Promise<{id: string;}>;}) {
  try {
    const { id } = await context.params;
    const need = await prisma.communityNeeds.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          ProblemDescription: true,
          ProblemCategory: true,
          peopleAffected: true,
          maxAffectedPeople: true,
          hasDeadline: true,
          deadLine: true,
          location: true,
          latitude: true,
          longitude: true,
          urgencyLevel: true,
          status: true,
          voulenteersWorking: true,
          createdAt: true,
          updatedAt: true,
          images: true,
          maxVolunteers: true,
          ngo: {
            select: {
              ngoName: true,
              city: true,
              isVerified: true,
            },
          },
        },
      });

    if (!need) {
      return NextResponse.json(
        {
          message:
            "Community need not found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json({
      success: true,
      need,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message:
          "Failed to fetch community need",
      },
      {
        status: 500,
      }
    );
  }
}
