import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNgoFromToken } from "@/lib/ngo-auth";

export async function GET() {
  try {
    const decoded = await getNgoFromToken();
    const ngo = await prisma.ngo.findUnique({
      where: {
        id: (decoded as any).ngoId,
      },
      select: {
        id: true,
        ngoName: true,
        email: true,
        isVerified: true,
        city: true,
        Address : true , 
        type : true , 
        motto : true , 
        yearOfEstablishment : true , 
      },
    });

    return NextResponse.json({
      ngo,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
}