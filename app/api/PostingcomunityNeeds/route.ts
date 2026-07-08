import { NextRequest , NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { communityNeedsSchema } from "@/lib/validations";
import { getNgoFromToken } from "@/lib/ngo-auth";
import { recalculateAllUrgency } from "@/utils/urgencyCalc";
import { ngoVerificationCheck } from "@/utils/ngoVerficationCheck";
import z from "zod";
export async function POST(req:NextRequest)
{
    try {
        const decod = await getNgoFromToken();
        if(!decod) return NextResponse.json({message:"Unauthorized"},{status:401})
        const ngoId = (decod as any).ngoId
        await ngoVerificationCheck(ngoId);
        const body = await req.json() ; 
        if (body.deadLine) {
         body.deadLine = new Date(body.deadLine);
        }
        const validatedData = communityNeedsSchema.parse(body);
        if(validatedData.hasDeadline && !validatedData.deadLine){
            return NextResponse.json({
                message:"Deadline is required"
            },
        {
            status:400
        })
        }
      const need =await prisma.communityNeeds.create({
        data: {
          ngoId,
          ProblemDescription:
            validatedData.ProblemDescription,
          ProblemCategory:
            validatedData.ProblemCategory,
          peopleAffected:
            validatedData.peopleAffected,
          maxAffectedPeople:
            validatedData.maxAffectedPeople,
          hasDeadline:
            validatedData.hasDeadline,
          deadLine:
            validatedData.deadLine? new Date(validatedData.deadLine): null,
          location:
            validatedData.location,
          latitude:
            validatedData.latitude,
          longitude:
            validatedData.longitude,
          images:
            validatedData.images,
          maxVolunteers:
            validatedData.maxVolunteers,
          voulenteersWorking: 0,
          urgencyLevel: 0,
        },
      });
   await recalculateAllUrgency();
    const updatedNeed =
      await prisma.communityNeeds.findUnique({
        where: {
          id: need.id,
        },
      });
    return NextResponse.json(
      {
        success: true,
        message:
          "Community need created successfully",
        need: updatedNeed,
      },
      {
        status: 201,
      }
    );
} catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message:
            "Validation failed",
          errors:
            error.flatten(),
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      {
        message:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}