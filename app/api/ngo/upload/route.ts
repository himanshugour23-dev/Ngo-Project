import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import {getNgoFromToken} from "@/lib/ngo-auth";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json(
        {
          message: "File missing",
        },
        {
          status: 400,
        }
      );
    }
    const bytes = await file.arrayBuffer();
    const allowedTypes = ["image/jpeg", "image/png", "image/webp","image/jpg","application/pdf"];
    if(!allowedTypes.includes(file.type)){
        return NextResponse.json(
            {
              message: "Invalid file type",
            },
            {
              status: 400,
            }
        )
    }
    if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            {
              message: "File size too large",
            },
            {
              status: 400,
            }
          );
        }
    const buffer = Buffer.from(bytes);
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "ngo-certificates",
            resource_type: "auto",
            transformation : [
              {
                quality : "auto",
                resource_type : "auto",
              }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });
    return NextResponse.json({
  success: true,
  url: result.secure_url,
});
  } catch (error) {
    console.log(error,'cloudinary error ');
    return NextResponse.json(
      {
        message: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}