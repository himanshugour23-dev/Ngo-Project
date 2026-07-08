// app/(volunteer)/needs/page.tsx
// Adjust the path to wherever your needs listing lives in your route structure

import NeedsClient from "@/app/user/(needs)/availableNeeds/NeedsClient";

export const dynamic = "force-dynamic";

async function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export type NeedCard = {
  id: string;
  ProblemCategory: string;
  urgencyLevel: number;
  location: string;
  images: string[];
  peopleAffected: number | null;
  maxVolunteers: number | null;
  voulenteersWorking: number;
  createdAt: string;
  ngo: { ngoName: string };
};

export default async function NeedsPage() {
  try {
    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/communityNeeds`, { cache: "no-store" });
    const data = res.ok ? await res.json() : null;
    const needs: NeedCard[] = data?.needs ?? [];
    return <NeedsClient needs={needs} />;
  } catch {
    return <NeedsClient needs={[]} />;
  }
}