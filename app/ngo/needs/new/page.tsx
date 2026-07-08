// app/ngo/needs/new/page.tsx
import { cookies } from "next/headers";
import PostNeedClient from "@/app/ngo/needs/PostNeedClient";

export const dynamic = "force-dynamic";

async function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function fetchJson(path: string) {
  const baseUrl = await getBaseUrl();
  const cookieHeader = (await cookies()).toString();
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function PostNeedPage() {
  const ngoData = await fetchJson("/api/ngo/me");
  const ngo = ngoData?.ngo ?? null;
  return <PostNeedClient ngo={ngo} />;
}