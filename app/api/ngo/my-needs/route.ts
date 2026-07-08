import { NextRequest , NextResponse } from "next/server";
import { getNgoFromToken } from "@/lib/ngo-auth";
import {prisma} from "@/lib/prisma"
export async function GET( req:NextRequest){
    try{
    const ngo = await getNgoFromToken()
    if (!ngo) { return NextResponse.json(
      { message: "Unauthorized" },{ status: 401 }              );
    }
    const [activeNeeds, completedNeeds] = await Promise.all([
        prisma.communityNeeds.findMany({
            where: {
            ngoId: (ngo as any).ngoId,
            status: {
                not: "resolved",
            },
            },
            orderBy: {
            createdAt: "desc",
            },
            select: {
            id: true,
            ProblemDescription: true,
            ProblemCategory: true,
            images: true,
            deadLine: true,
            location: true,
            urgencyLevel: true,
            voulenteersWorking: true,
            maxVolunteers: true,
            status: true,
            },
        }),
        prisma.communityNeeds.findMany({
            where: {
            ngoId: (ngo as any).ngoId,
            status: "resolved",
            },
            orderBy: {
            createdAt: "desc",
            },
            select: {
            id: true,
            ProblemDescription: true,
            ProblemCategory: true,
            images: true,
            deadLine: true,
            location: true,
            urgencyLevel: true,
            voulenteersWorking: true,
            maxVolunteers: true,
            status: true,
            },
                }),
            ]);
    return NextResponse.json(
        {
        activeNeeds,
        completedNeeds,
        },
        {
        status: 200,
        }
    );
    }
    catch (error) {
    console.error(error);
    return NextResponse.json(
        {
        message: "Internal Server Error",
        },
        {
        status: 500,
        }
    );
    }
}
