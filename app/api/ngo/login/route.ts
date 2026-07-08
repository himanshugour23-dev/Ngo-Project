import { NextRequest , NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateAccessToken ,generateRefreshToken} from "@/lib/jwt";
import {headers} from "next/headers" 
import {auth} from "@/lib/auth"
export async function POST(request : NextRequest){
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
            });
            if (session) {
            return NextResponse.json({error:"First Logout as user to login as NGO",},
                {status: 401,});
            }
        const body = await request.json() ; 
        const { email , password } = body ;
        const ngo = await prisma.ngo.findUnique({
            where : {
                email,
            },
        })
        if(!ngo){
            return NextResponse.json(
                {
                    message : "Invalid email or password",
                },
                {
                    status : 401,
                }
            )
        }
           if (!ngo.isVerified) {
            return NextResponse.json(
                {
                message: "Wait for moderator approval Before login",
                },
                {
                status: 401,
                }
            );
            }
    const isPaswordCorrect =await bcrypt.compare(password , ngo.password) ; 
    if(!isPaswordCorrect){
        return NextResponse.json(
            {
                message : "Invalid email or password",
            },
            {
                status : 401,
            }
        )
    }
    const accessToken = generateAccessToken(ngo.id) ;
    const refreshToken = generateRefreshToken(ngo.id) ;
    const response = NextResponse.json(
         {
            success : true ,
            isVerified : ngo.isVerified ,
            ngo : {
                id : ngo.id ,
                ngoName : ngo.ngoName ,
                email : ngo.email ,
            }
         }
    );

    response.cookies.set("ngo_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15,
      path: "/",
    });

    response.cookies.set("ngo_refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
    } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}  