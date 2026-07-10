import { cookies } from "next/headers";
import DashboardClient from "./DashboardClient";

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

  const text = await res.text();
  if (!res.ok) {
    return null;
  }
  return JSON.parse(text);
}
export default async function NgoDashboardPage() {
  const [ngoRes, dashboardRes] = await Promise.all([
    fetchJson("/api/ngo/me"),
    fetchJson("/api/ngo/dashboard"),
  ]);

  const ngo = ngoRes?.ngo ?? null;
  const dashboard = dashboardRes?.dashboard ?? {
    activeNeeds: 0,
    completedNeeds: 0,
    pendingRequests: 0,
    volunteersWorking: 0,
  };

  return <DashboardClient ngo={ngo} dashboard={dashboard} />;
}