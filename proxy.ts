import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ngoAccessToken = req.cookies.get("ngo_access_token")?.value;
  const userSession =
  req.cookies.get("__Secure-better-auth.session_token")?.value ??
  req.cookies.get("better-auth.session_token")?.value;
  
  if (pathname.startsWith("/ngo/")) {
    if (!ngoAccessToken) {
      return NextResponse.redirect(
        new URL("/ngo-login", req.url)
      );
    }
  }
  if(pathname.startsWith("/ngo-login")){
      if(ngoAccessToken){
        return NextResponse.redirect(
            new URL("/ngo/dashboard", req.url)
          );
      }
  }
  if(pathname.startsWith("/ngo-login")){
      if(userSession){
        return NextResponse.redirect(
            new URL("/user/profilePage", req.url)
          );
      }
  }

  if (pathname.startsWith("/user")) {
  if (!userSession && !ngoAccessToken) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }
}
  // if (pathname.startsWith("/user")) {
  //   if (!userSession) {
  //     return NextResponse.redirect(
  //       new URL("/login", req.url)
  //     );
  //   }
  // }
  if (pathname === "/login" && userSession) {
    return NextResponse.redirect(
      new URL("/user/profilePage", req.url)
    );
  }

  if (pathname === "/ngo-login" && ngoAccessToken) {
    return NextResponse.redirect(
      new URL("/ngo/dashboard", req.url)
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*","/ngo/:path*","/login","/ngo-login",],
};