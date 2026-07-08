import { v2 as cloudinary  } from "cloudinary";

cloudinary.config({
    cloud_name : process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

export default cloudinary  

/*
import cloudinary from "@/utils/cloudinary";
import { NextResponse,NextRequest } from "next/server";
import {auth} from "@clerk/nextjs/server";
// Upload an image
interface CloudinaryUploadResult{
    public_id: string;
    [key: string ]:  any ;
}
   
export async function POST(req: NextRequest){
    const {userId} = await auth();
    if(!userId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File| null;
        if(!file){
            return NextResponse.json({error: "No file provided"}, {status: 400});
        }
       const bytes =  await file.arrayBuffer()
       const buffer = Buffer.from(bytes)
       const result = await new Promise<CloudinaryUploadResult>((resolve,reject)=>{
          cloudinary.uploader.upload_stream(
            {folder: "next-cloudinary-uploads"},
            (error,result)=>{
                if(error) reject(error);
                 else resolve(result as CloudinaryUploadResult)
            }
          ).end(buffer)
       }
    )
       return NextResponse.json(
        {
            publicId : result.public_id
        },
        {
            status: 200
        }
    );
} catch (error) {
        console.log("cloudinary image upload error ",error)
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}

*/