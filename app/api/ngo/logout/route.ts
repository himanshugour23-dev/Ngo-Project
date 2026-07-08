import { NextResponse } from "next/server";
export async function POST() {
    try {
        const response = NextResponse.json(
            {success : true}
        )
        response.cookies.set("ngo_access_token", "", {
            expires: new Date(0),
            path: "/",
        });
        response.cookies.set("ngo_refresh_token", "", {
            expires: new Date(0),
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            {
                message : "Some Error in Logging out",
            },
            {
                status : 500,
            }
        );   
    }
}