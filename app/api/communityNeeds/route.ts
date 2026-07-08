import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    console.time("count");
await prisma.communityNeeds.count();
console.timeEnd("count");
    console.time("needs");
    const needs =
      await prisma.communityNeeds.findMany({
        where: {
          status: {
            not: "resolved",
          },
        },
        orderBy: {
          urgencyLevel: "desc",
        },
        select: {
          id: true,
          ProblemCategory: true,
          urgencyLevel: true,
          location: true,
          images: true,
          peopleAffected: true,
          maxVolunteers: true,
          voulenteersWorking: true,
          createdAt: true,
          ngo: {
            select: {
              ngoName: true,
            },
          },
        },
      });
console.timeEnd("needs");
    return NextResponse.json({
      success: true,
      count: needs.length,
      needs,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message:
          "Failed to fetch community needs",
      },
      {
        status: 500,
      }
    );
  }
}