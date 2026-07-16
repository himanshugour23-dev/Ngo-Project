import { cookies } from "next/headers";
import ListedVoulenteersClient from "@/app/ngo/needs/[id]/listed-voulenteers/ListedVoulenteersClient";

export const dynamic = "force-dynamic";

async function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

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

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function ListedVoulenteersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [volunteersData, ngoData] = await Promise.all([
    fetchJson(`/api/communityNeeds/${id}/listed-voulenteer`),
    fetchJson("/api/ngo/me"),
  ]);

  const volunteers = volunteersData?.voulenteers ?? [];
  const ngo = ngoData?.ngo ?? null;

  return (
    <ListedVoulenteersClient
      needId={id}
      volunteers={volunteers}
      ngo={ngo}
    />
  );
}