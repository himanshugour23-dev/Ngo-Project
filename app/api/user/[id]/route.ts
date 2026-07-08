import {auth} from "@/lib/auth";
import { NextResponse,NextRequest} from "next/server" ; 
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { getNgoFromToken } from "@/lib/ngo-auth";
import { z } from "zod";

interface updateProfileBody{
    name ?: string,
    bio ?: string,
    skills ?: string[],
    preferredCategories ?: string[],
    isActive ?: boolean
}
const  updateUserSchemaBasic = z.object({
    name : z.string().min(3).optional(),
    bio : z.string().max(300).nullable().optional(),
    skills : z.array(z.string()).optional(),
    preferredCategories : z.array(z.string()).optional(),
    isActive : z.boolean().optional()
})

export async function GET(req:NextRequest , context : {params : Promise<{id:string}>}){
    try {
        const {id : userId} = await context.params ; 
        const ngo = await getNgoFromToken().catch(() => null);
        console.time("session")
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        console.timeEnd("session")
        console.time("isOwner")
        const isOwner = session?.user?.id === userId ; 
        console.timeEnd("isOwner")

        console.time("user")
        const user = await prisma.user.findUnique({
            where : {
                id : userId
            }
        })
        console.timeEnd("user")
        if(!user) return NextResponse.json({error : "User not found"} , {status : 404});
        if(user.isBanned && !isOwner) return NextResponse.json({error : "User is banned"} , {status : 401});
        if(isOwner){
            return NextResponse.json({
                 id : user.id ,
                 name : user.name ,
                 email : user.email ,
                 image : user.image ,
                 rating : user.rating ,
                 ratingCount : user.ratingCount ,
                 skills : user.skills??"",
                 preferredCategories : user.preferredCategories??[],
                 bio : user.bio,
                 isActive : user.isActive,
                 taskCompleted : user.taskCompleted,
                })
            }
            if(ngo){
                return NextResponse.json({
                      id : user.id , 
                      name : user.name , 
                      email : user.email ,
                      image : user.image ,
                      rating : user.rating , 
                      ratingCount : user.ratingCount , 
                      skills : user.skills , 
                      preferredCategories : user.preferredCategories , 
                      bio : user.bio , 
                      isActive : user.isActive ,
                      taskCompleted : user.taskCompleted
                })
            }
              return NextResponse.json({
                    id : user.id , 
                    name : user.name ,
                    image : user.image,
                    bio : user.bio 
                })
    } catch (error) {
        return NextResponse.json({error : "Something went wrong while fetching user profile"} , {status : 500})        
    }
}

export async function PATCH(req : NextRequest , context : { params : Promise<{ id  : string}>}){
    try{
        const {id : userId} = await context.params ; 
        const session = await auth.api.getSession({headers : await headers()});
        if(!session) return NextResponse.json({error : "Unauthorized"} , {status : 401});
        const isOwner = session?.user?.id === userId ; 
        if(!isOwner){
            return NextResponse.json({error : "Unauthorized"} , {status : 401});
        }
        const body : updateProfileBody = await req.json() ;
        // har route me zod ka ye error kia h maine last me check it again 
        const result = updateUserSchemaBasic.safeParse(body);
           if (!result.success) {
                console.log("BODY:", body);
                console.log(
                "ZOD ERROR:",
                result.error.flatten()
                );

                return NextResponse.json(
                    {error: result.error.flatten()},
                    {status: 400}
                );
            }
        const validatedData = result.data;
        const {name, bio , skills , preferredCategories ,isActive } = validatedData ;
        await prisma.user.update({
            where : {
                id : userId
            },
            data : {
                ...(name !==undefined && {name}),
                ...(bio !==undefined && {bio}),
                ...(skills !==undefined && {skills}),
                ...(preferredCategories !==undefined && {preferredCategories}),
                ...(isActive !==undefined && {isActive}) 
            }
        })
        return NextResponse.json("Your details updated successfully" , {status : 200}) ; 
    }catch(error){
        console.log(error,"Normal changing error") 
        return NextResponse.json({error : "Something went wrong while updating user profile"} , {status : 500})        
    }
}