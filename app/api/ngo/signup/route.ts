import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ngoSignupSchema } from "@/lib/validations";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ngoSignupSchema.parse(body);

    const existingNgo = await prisma.ngo.findFirst({
      where: {
        email: validatedData.email,
      },
    });

    if (existingNgo && existingNgo.isEmailVerified === false) {
      const hashedPassword = await bcrypt.hash(
        validatedData.password,
        10
      );

      const ngo = await prisma.$transaction(async (tx) => {
        await tx.ngo.delete({
          where: {
            id: existingNgo.id,
          },
        });

        const newNgo = await tx.ngo.create({
          data: {
            ngoName: validatedData.ngoName,
            email: validatedData.email,
            password: hashedPassword,
            Address: validatedData.Address,
            city: validatedData.city,
            motto: validatedData.motto,
            latitude: validatedData.latitude,
            longitude: validatedData.longitude,
            registrationCertificate:
              validatedData.registrationCertificate,
            type: validatedData.type,
            eightyGNumber: validatedData.eightyGNumber,
            twelveGNumber: validatedData.twelveGNumber,
            yearOfEstablishment:
              validatedData.yearOfEstablishment
                ? new Date(validatedData.yearOfEstablishment)
                : new Date(),
          },
        });

        return newNgo;
      });

      return NextResponse.json(
        {
          success: true,
          message:
            "NGO registered successfully. Awaiting approval.",
          ngo,
        },
        {
          status: 201,
        }
      );
    }

    if (existingNgo && existingNgo.isEmailVerified === true) {
      return NextResponse.json(
        {
          message: "NGO already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      10
    );

    const ngo = await prisma.ngo.create({
      data: {
        ngoName: validatedData.ngoName,
        email: validatedData.email,
        password: hashedPassword,
        Address: validatedData.Address,
        city: validatedData.city,
        motto: validatedData.motto,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        registrationCertificate:
          validatedData.registrationCertificate,
        type: validatedData.type,
        eightyGNumber: validatedData.eightyGNumber,
        twelveGNumber: validatedData.twelveGNumber,
        yearOfEstablishment:
          validatedData.yearOfEstablishment
            ? new Date(validatedData.yearOfEstablishment)
            : new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "NGO registered successfully. Awaiting approval.",
        ngo,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Error occurred while signing up",
      },
      {
        status: 500,
      }
    );
  }
}