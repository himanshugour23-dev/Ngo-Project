import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { headers } from "next/headers";
import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma"
const MAX_FILE_SIZE = 10 * 1024 * 1024; 
export async function POST(req: NextRequest) {
  try {
    const session =  await auth.api.getSession({headers : await headers()});
    if(!session) return NextResponse.json({error : "Unauthorized"} , {status : 401});

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
    const allowedTypes = ["image/jpeg", "image/png", "image/webp","image/jpg"] ;
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          message: "Invalid file type",
        },
        {
          status: 400,
        }
      );
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
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "voulenteer-profile-pic-images",
            resource_type: "image",
            transform : [{
                width: 500,
                height: 500,
                crop: "fill"
            }]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });
    await prisma.user.update({
        where : {
            id : session.user.id
        },
        data : {
            image : result.secure_url
        }
    })
    return NextResponse.json({
      success: true,
      imageUrl:result.secure_url,
      message:"Profile image updated successfully",
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