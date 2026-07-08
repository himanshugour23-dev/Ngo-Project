import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import {getNgoFromToken} from "@/lib/ngo-auth";
const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export async function POST(req: NextRequest) {
  try {
    const token = await getNgoFromToken()
    if(!token) return NextResponse.json({error : "Unauthorized"} , {status : 401});
    console.log("waiting for files");
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];
    console.log("Files:", files);
    if (files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No files uploaded",
        },
        {
          status: 400,
        }
      );
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        {
          success: false,
          message: `Maximum ${MAX_FILES} images allowed`,
        },
        {
          status: 400,
        }
      );
    }
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message: `${file.name} is not a supported image.`,
          },
          {
            status: 400,
          }
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: `${file.name} exceeds the 10 MB limit.`,
          },
          {
            status: 400,
          }
        );
      }
    }
    console.log("Uploading images to Cloudinary Starts ");
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const result = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "communityNeeds",
              resource_type: "image",
              transformation: [
                {
                  quality: "auto",
                },
              ],
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(buffer);
        });
        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      })
    );
      console.log("Uploading images to Cloudinary Ends ");
    return NextResponse.json({
        success: true,
        message: "Images uploaded successfully",
        images: uploadedImages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({
        success: false,
        message: "Upload failed",
      },{status: 500,}
    );
  }
}