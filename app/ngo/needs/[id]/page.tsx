// app/ngo/needs/[id]/requests/page.tsx
'use client';
import { cookies } from "next/headers";
import RequestsClient from "@/app/ngo/needs/[id]/RequestsClient";
import type { RequestItem } from "@/app/ngo/needs/RequestItem"

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

export default async function NeedRequestsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [requestsData, ngoData] = await Promise.all([
    fetchJson(`/api/communityNeeds/${id}/request`),
    fetchJson("/api/ngo/me"),
  ]);

  const requests: RequestItem[] = requestsData?.requests ?? [];
  const ngo = ngoData?.ngo ?? null;
  const fetchFailed = !requestsData;

  return (
    <RequestsClient
      needId={id}
      initialRequests={requests}
      ngo={ngo}
      fetchFailed={fetchFailed}
    />
  );
}