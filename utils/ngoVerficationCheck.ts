import {prisma} from "@/lib/prisma";
export async function ngoVerificationCheck(ngoId : string){
    const ngo = await prisma.ngo.findUnique({
        where : {
            id : ngoId
        },
        select : {
            isVerified : true
        }
    });
    if(!ngo){
       throw new Error("Ngo not found");
    }
    if(!ngo.isVerified){
        throw new Error("Ngo not verified");
    }
    return true ; 
}