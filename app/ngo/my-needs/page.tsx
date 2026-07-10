import { cookies } from "next/headers";
import MyNeedsClient from "@/app/ngo/MyNeedsClient/MyNeedsClient";
import type { NeedItem } from "@/app/ngo/my-needs/types";
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

export default async function MyNeedsPage() {
  const [needsData, ngoData] = await Promise.all([
    fetchJson("/api/ngo/my-needs"),
    fetchJson("/api/ngo/me"),
  ]);

  const activeNeeds: NeedItem[] = needsData?.activeNeeds ?? [];
  const completedNeeds: NeedItem[] = needsData?.completedNeeds ?? [];
  const ngo = ngoData?.ngo ?? null;

  return (
    <MyNeedsClient activeNeeds={activeNeeds} completedNeeds={completedNeeds} ngo={ngo} />
  );
}