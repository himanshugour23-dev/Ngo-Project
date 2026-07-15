"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Users, CheckCircle2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/StarRating";
import NgoTopBar from "@/components/NgoTopBar";
type Volunteer = {
  assignmentId: string;
  user: {
    id: string;
    name: string;
    email: string;
    rating: number;
    ratingCount: number;
    image: string | null;
    taskCompleted: number;
  };
  ratingFromAssignment: { id: string; rating: number } | null;
};

export default function RateVolunteersClient({ needId }: { needId: string }) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/communityNeeds/${needId}/rate-volunteers`)
      .then((r) => r.json())
      .then((data) => setVolunteers(data.voulenteers ?? []))
      .finally(() => setLoading(false));
  }, [needId]);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = {
        ratings: Object.entries(ratings).map(([assignmentId, rating]) => ({ assignmentId, rating })),
      };
      const res = await fetch(`/api/communityNeeds/${needId}/rate-volunteers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      const refreshed = await fetch(`/api/communityNeeds/${needId}/rate-volunteers`).then((r) => r.json());
      setVolunteers(refreshed.voulenteers ?? []);
      setRatings({});
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }
  const unratedCount = volunteers.filter((v) => !v.ratingFromAssignment).length;
  const pendingSelections = Object.keys(ratings).length;
  return (
    <div className="min-h-screen bg-[#faf8f4] font-['Nunito',sans-serif] text-[#1c2b1e]">
      <NgoTopBar backHref="/ngo/my-needs" backLabel="My Needs" />
      <main className="max-w-[900px] mx-auto px-4 sm:px-10 py-6 sm:py-10">
        <div className="mb-6 sm:mb-9">
          <div className="text-[0.68rem] sm:text-xs font-bold tracking-[0.1em] text-[#d4890a] uppercase mb-1.5 sm:mb-2">
            Task completed
          </div>
          <h2 className="font-['Playfair_Display',serif] text-[1.4rem] sm:text-[2.1rem] font-bold text-[#1c2b1e] mb-1.5 sm:mb-2">
            Rate your volunteers
          </h2>
          <p className="text-[0.82rem] sm:text-sm text-[#6b7e6d] max-w-[560px]">
            Rate each volunteer out of 5 based on their contribution to this need.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl bg-[#f0ede5]" />
            ))}
          </div>
        ) : volunteers.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-[#ece8e0] rounded-2xl bg-white">
            <Users className="h-5 w-5 text-[#8a9e8c] mb-3" />
            <p className="text-sm text-[#8a9e8c]">No completed volunteers found for this need.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {volunteers.map((v) => {
              const alreadyRated = v.ratingFromAssignment !== null;
              return (
                <Card
                  key={v.assignmentId}
                  className="border border-[#ece8e0] rounded-2xl bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative h-11 w-11 rounded-full overflow-hidden bg-[#f4f1ea] shrink-0">
                      {v.user.image ? (
                        <Image src={v.user.image} alt={v.user.name} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs font-bold text-[#8a9e8c]">
                          {v.user.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#1c2b1e] truncate">{v.user.name}</div>
                      <div className="text-xs text-[#8a9e8c] truncate">{v.user.email}</div>
                      <div className="text-[0.7rem] text-[#8a9e8c] mt-0.5">
                        {v.user.taskCompleted} tasks completed · overall {v.user.rating.toFixed(1)}★
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {alreadyRated ? (
                      <Badge className="bg-[#e6f4ec] text-[#1b5e38] hover:bg-[#e6f4ec] border-0 gap-1.5 px-3 py-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Already rated {v.ratingFromAssignment!.rating}/5
                      </Badge>
                    ) : (
                      <StarRating
                        value={ratings[v.assignmentId] ?? 0}
                        onChange={(val) => setRatings((prev) => ({ ...prev, [v.assignmentId]: val }))}
                      />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        {!loading && unratedCount > 0 && (
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 justify-end">
            {submitted && (
              <span className="text-xs text-[#2d6a4f] font-semibold">Ratings saved.</span>
            )}
            <Button
              onClick={handleSubmit}
              disabled={pendingSelections === 0 || submitting}
              className="w-full sm:w-auto rounded-xl bg-[#2d6a4f] hover:bg-[#245a43] text-white font-semibold px-6 py-2.5"
            >
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit Ratings ({pendingSelections})
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}