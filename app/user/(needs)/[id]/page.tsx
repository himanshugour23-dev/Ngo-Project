// app/needs/[id]/page.tsx

import NeedDetailClient from "@/app/user/(needs)/[id]/NeedDetailClient";

export const dynamic = "force-dynamic";

async function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export type NeedDetail = {
  id: string;
  ProblemDescription: string;
  ProblemCategory: string;
  peopleAffected: number | null;
  maxAffectedPeople: number | null;
  hasDeadline: boolean;
  deadLine: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  urgencyLevel: number;
  status: string;
  voulenteersWorking: number;
  maxVolunteers: number | null;
  images: string[];
  createdAt: string;
  updatedAt: string;
  ngo: {
    ngoName: string;
    city: string | null;
    isVerified: boolean;
  };
};

export default async function NeedDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/communityNeeds/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return <NeedDetailClient need={null} error="This need could not be found." />;
    }

    const data = await res.json();
    return <NeedDetailClient need={data.need} error={null} />;
  } catch {
    return <NeedDetailClient need={null} error="Failed to load this need." />;
  }
}