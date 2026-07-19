import { cookies } from "next/headers";
import AvailableVolunteersClient from "./AvailableVolunteersClient";

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
    console.log(`Failed to fetch ${path}:`,res.status);
    return null;
  }
  return res.json();
}

export default async function AvailableVolunteersPage() {

  const [volunteersData,ngoData,needsData,] = await Promise.all([
    fetchJson("/api/ngo/fetch-active-volunteers"),
    fetchJson("/api/ngo/me"),
    fetchJson("/api/ngo/my-needs"),
  ]);
  const volunteers =
    volunteersData?.usersActive ?? [];

  const ngo =
    ngoData?.ngo ?? null;
  const needs =
    needsData?.activeNeeds ?? [];
  return (
    <AvailableVolunteersClient
      volunteers={volunteers}
      ngo={ngo}
      needs={needs}
    />
  );
}