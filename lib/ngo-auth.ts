import { cookies, headers } from "next/headers";
import { verifyAccessToken } from "./jwt";

export async function getNgoFromToken() {
  const cookieStore = await cookies();
  let token = cookieStore.get("ngo_access_token")?.value;
  if (!token) {
    const authHeader = (await headers()).get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }
  if (!token) {
    throw new Error("Unauthorized");
  }
  return verifyAccessToken(token);
}