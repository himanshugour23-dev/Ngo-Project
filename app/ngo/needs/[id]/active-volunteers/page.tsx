// app/ngo/needs/[id]/active-volunteers/page.tsx

import { cookies } from "next/headers";
import ActiveVolunteersClient from "@/app/ngo/needs/[id]/active-volunteers/ActiveVoulenteersClient";

export const dynamic = "force-dynamic";

async function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL)
    return process.env.NEXT_PUBLIC_BASE_URL;

  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}`;

  return "http://localhost:3000";
}

async function fetchJson(path: string) {
  const baseUrl = await getBaseUrl();
  const cookieHeader = (await cookies()).toString();

  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

export default async function ActiveVolunteersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [volunteersData, ngoData] = await Promise.all([
    fetchJson(`/api/communityNeeds/${id}/active-voulenteer`),
    fetchJson("/api/ngo/me"),
  ]);

  const volunteers = volunteersData?.voulenteers ?? [];
  const ngo = ngoData?.ngo ?? null;

  return (
    <ActiveVolunteersClient
      needId={id}
      volunteers={volunteers}
      ngo={ngo}
    />
  );
}