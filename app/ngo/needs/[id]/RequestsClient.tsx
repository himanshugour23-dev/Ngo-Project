// app/ngo/needs/[id]/requests/RequestsClient.tsx
"use client";

import { useState } from "react";
import {
  Star,
  MapPin,
  Briefcase,
  CheckCircle2,
  XCircle,
  Loader2,
  Inbox,
  AlertTriangle,
  Mail,
  Tag,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NgoTopBar from "@/components/NgoTopBar";
import type { RequestItem } from "@/app/ngo/needs/RequestItem";

type ActionState = "idle" | "loading" | "error";

function initialsOf(name: string) {
  return (
    name
      ?.split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "U"
  );
}

function RequestCard({
  request,
  onResolve,
}: {
  request: RequestItem;
  onResolve: (assignmentId: string, status: "approved" | "rejected") => Promise<boolean>;
}) {
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [state, setState] = useState<ActionState>("idle");

  const u = request.user;
  const skills = u.skills ?? [];
  const categories = u.preferredCategories ?? [];

  async function handle(decision: "approved" | "rejected") {
    if (state === "loading") return;
    setAction(decision === "approved" ? "approve" : "reject");
    setState("loading");
    const ok = await onResolve(request.id, decision);
    if (!ok) {
      setState("error");
    }
    // on success, the card is removed by the parent — no need to reset state
  }

  return (
    <Card className="border border-[#ece8e0] rounded-2xl p-5 sm:p-6 bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
      <div className="flex items-start gap-3.5 mb-4">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#e8f5ee] flex items-center justify-center text-[#1b5e38] font-bold text-sm shrink-0">
          {initialsOf(u.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[0.95rem] font-bold text-[#1c2b1e] truncate">{u.name}</div>
          <div className="flex items-center gap-1.5 text-xs text-[#8a9e8c] truncate">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate">{u.email}</span>
          </div>
        </div>
        {u.rating !== null && u.rating !== undefined && (
          <div className="flex items-center gap-1 bg-[#fff4e0] text-[#7a4800] text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
            <Star className="h-3 w-3 fill-current" />
            {u.rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4 text-xs text-[#6b7e6d]">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#8a9e8c]" />
          {u.city ?? "City not set"}
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5 text-[#8a9e8c]" />
          {u.taskCompleted} {u.taskCompleted === 1 ? "task" : "tasks"} completed
        </div>
      </div>

      {skills.length > 0 && (
        <div className="mb-3">
          <div className="text-[0.65rem] font-bold uppercase tracking-wide text-[#8a9e8c] mb-1.5">
            Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <Badge
                key={s}
                className="bg-[#e6f0fb] text-[#1c3f73] hover:bg-[#e6f0fb] border-0 text-[0.7rem] font-semibold capitalize"
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div className="mb-4">
          <div className="text-[0.65rem] font-bold uppercase tracking-wide text-[#8a9e8c] mb-1.5 flex items-center gap-1">
            <Tag className="h-3 w-3" /> Prefers
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <Badge
                key={c}
                className="bg-[#f4f1ea] text-[#6b7e6d] hover:bg-[#f4f1ea] border-0 text-[0.7rem] font-semibold capitalize"
              >
                {c}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="flex items-center gap-1.5 text-xs text-[#8b1c1c] bg-[#fde8e8] rounded-lg px-3 py-2 mb-3.5">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          Something went wrong. Please try again.
        </div>
      )}

      <div className="flex gap-2.5">
        <Button
          onClick={() => handle("approved")}
          disabled={state === "loading"}
          className="flex-1 bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-bold rounded-xl h-10 gap-1.5"
        >
          {state === "loading" && action === "approve" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          Accept
        </Button>
        <Button
          onClick={() => handle("rejected")}
          disabled={state === "loading"}
          variant="outline"
          className="flex-1 border-[#f3c9c9] text-[#8b1c1c] hover:bg-[#fde8e8] hover:text-[#8b1c1c] font-bold rounded-xl h-10 gap-1.5"
        >
          {state === "loading" && action === "reject" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          Reject
        </Button>
      </div>
    </Card>
  );
}

export default function RequestsClient({
  needId,
  initialRequests,
  ngo,
  fetchFailed,
}: {
  needId: string;
  initialRequests: RequestItem[];
  ngo?: {
    ngoName?: string | null;
    city?: string | null;
    type?: string | null;
    isVerified?: boolean;
  } | null;
  fetchFailed: boolean;
}) {
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);

  async function resolveRequest(
    assignmentId: string,
    status: "approved" | "rejected"
  ): Promise<boolean> {
    try {
      const res = await fetch(
        `/api/communityNeeds/${needId}/request/${assignmentId}/${status}`,
        { method: "POST" }
      );
      if (!res.ok) return false;

      setRequests((prev) => prev.filter((r) => r.id !== assignmentId));
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f4] font-['Nunito',sans-serif] text-[#1c2b1e]">
      <NgoTopBar
        ngoName={ngo?.ngoName}
        city={ngo?.city}
        type={ngo?.type}
        isVerified={ngo?.isVerified}
        backHref="/ngo/my-needs"
        backLabel="My needs"
      />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-10 py-6 sm:py-10">
        <div className="mb-6 sm:mb-9">
          <div className="text-[0.68rem] sm:text-xs font-bold tracking-[0.1em] text-[#d4890a] uppercase mb-1.5 sm:mb-2">
            Pending requests
          </div>
          <h2 className="font-['Playfair_Display',serif] text-[1.4rem] sm:text-[2.1rem] font-bold text-[#1c2b1e] mb-1.5 sm:mb-2">
            Volunteer applications
          </h2>
          <p className="text-[0.82rem] sm:text-sm text-[#6b7e6d] max-w-[560px]">
            Review each volunteer and accept or reject their request to help with this need.
          </p>
        </div>

        {fetchFailed ? (
          <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 border border-dashed border-[#f3c9c9] rounded-2xl bg-white">
            <div className="w-12 h-12 rounded-full bg-[#fde8e8] flex items-center justify-center text-[#8b1c1c] mb-3">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <p className="text-sm text-[#8b1c1c] font-semibold mb-1">
              Couldn&apos;t load requests for this need.
            </p>
            <p className="text-xs text-[#8a9e8c]">
              You may not have access to this need, or it may no longer exist.
            </p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 border border-dashed border-[#ece8e0] rounded-2xl bg-white">
            <div className="w-12 h-12 rounded-full bg-[#f4f1ea] flex items-center justify-center text-[#8a9e8c] mb-3">
              <Inbox className="h-5 w-5" />
            </div>
            <p className="text-sm text-[#8a9e8c]">
              No pending requests for this need right now.
            </p>
          </div>
        ) : (
          <>
            <div className="text-xs text-[#8a9e8c] mb-4">
              {requests.length} {requests.length === 1 ? "volunteer" : "volunteers"} waiting
              for review
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {requests.map((r) => (
                <RequestCard key={r.id} request={r} onResolve={resolveRequest} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}