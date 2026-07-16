"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {MapPin,Calendar,Users,ArrowUpRight,Inbox,ImageOff,CheckCircle2,Loader2} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NgoTopBar from "@/components/NgoTopBar";
import type { NeedItem } from "@/app/ngo/my-needs/types";
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,
  AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const URGENCY: Record<string,{ label: string; bg: string; text: string; dot: string; bar: string }> = {
  HIGH: {
    label: "High urgency",
    bg: "bg-[#fde8e8]",
    text: "text-[#8b1c1c]",
    dot: "bg-[#c0392b]",
    bar: "bg-[#c0392b]",
  },
  MEDIUM: {
    label: "Medium urgency",
    bg: "bg-[#fff4e0]",
    text: "text-[#7a4800]",
    dot: "bg-[#d4890a]",
    bar: "bg-[#d4890a]",
  },
  LOW: {
    label: "Low urgency",
    bg: "bg-[#e6f4ec]",
    text: "text-[#1b5e38]",
    dot: "bg-[#2d6a4f]",
    bar: "bg-[#2d6a4f]",
  },
};

function urgencyStyle(level: number) {
  if (level >= 8) return URGENCY.HIGH;
  if (level >= 5) return URGENCY.MEDIUM;
  return URGENCY.LOW;
}

function formatDeadline(d: string | null) {
  if (!d) return "No deadline set";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "No deadline set";
  }
}

function NeedCard({ need, isActive }: { need: NeedItem; isActive: boolean }) {
  const router = useRouter();
  const [completing, setCompleting] = useState(false);
  const u = urgencyStyle(need.urgencyLevel);
  const pct =
    need.maxVolunteers > 0 ? Math.min(100, Math.round((need.voulenteersWorking / need.maxVolunteers) * 100)) : 0;
  const spotsLeft = Math.max(0, need.maxVolunteers - need.voulenteersWorking);
  const cover = need.images?.[0];

  async function handleMarkCompleted() {
    setCompleting(true);
    try {
      const res = await fetch(`/api/communityNeeds/${need.id}/resolve`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to resolve need");
      router.push(`/ngo/needs/${need.id}/rate-volunteers`);
    } catch (err) {
      console.error(err);
      setCompleting(false);
    }
  }
  return (
      <Card className="border border-[#ece8e0] rounded-2xl overflow-hidden bg-white hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 h-full">
        <div className="h-[150px] sm:h-[158px] relative bg-[#f4f1ea]">
          {cover ? (
            <Image src={cover} alt={need.ProblemDescription} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#c8d4ca]">
              <ImageOff className="h-8 w-8" />
            </div>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="inline-flex items-center gap-[5px] text-[0.68rem] font-bold px-2.5 py-1 rounded-xl bg-[#f4f1ea] text-[#1c2b1e]">
              Urgency: {need.urgencyLevel}
            </div>
            <Badge className="bg-[#f4f1ea] text-[#6b7e6d] hover:bg-[#f4f1ea] border-0 text-[0.65rem] font-bold capitalize shrink-0">
              {need.ProblemCategory}
            </Badge>
          </div>

          <div className="text-[0.9rem] font-bold text-[#1c2b1e] mb-2 leading-[1.4] line-clamp-2">
            {need.ProblemDescription}
          </div>

          <div className="flex flex-col gap-1.5 mb-3.5">
            <div className="flex items-center gap-1.5 text-xs text-[#8a9e8c]">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{need.location ?? "Location not specified"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#8a9e8c]">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{formatDeadline(need.deadLine)}</span>
            </div>
          </div>

          <div className="flex justify-between text-[0.72rem] text-[#8a9e8c] mb-1.5">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {need.voulenteersWorking} / {need.maxVolunteers} volunteers
            </span>
            <span>{spotsLeft} spots left</span>
          </div>
          <div className="h-1 bg-[#eae6e0] rounded-full mb-4">
            <div className={`h-full rounded-full ${u.bar}`} style={{ width: `${pct}%` }} />
          </div>

       <div className="flex flex-col gap-2">
  {isActive ? (
    <>
      <Link
        href={`/ngo/needs/${need.id}/requests`}
        className="w-full rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold py-2.5 flex items-center justify-center gap-2 hover:bg-[#245a43] transition"
      >
        View Pending Requests
        <ArrowUpRight className="h-4 w-4" />
      </Link>

      <Link
        href={`/ngo/needs/${need.id}/active-volunteers`}
        className="w-full rounded-xl border border-[#2d6a4f] text-[#2d6a4f] text-sm font-semibold py-2.5 flex items-center justify-center gap-2 hover:bg-[#e8f5ee] transition"
      >
        View Active Volunteers
        <ArrowUpRight className="h-4 w-4" />
      </Link>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full rounded-xl border-[#d4890a] text-[#d4890a] text-sm font-semibold py-2.5 hover:bg-[#fff4e0] hover:text-[#d4890a]"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark as Completed
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="bg-white border-[#ece8e0]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1c2b1e]">
              Mark this need as completed?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-[#6b7e6d]">
              All approved volunteers will be marked complete and this need
              will stop accepting invites. You&apos;ll be taken to the rating
              page next.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMarkCompleted}
              disabled={completing}
              className="bg-[#2d6a4f] hover:bg-[#245a43]"
            >
              {completing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  ) : (
    <Link
      href={`/ngo/needs/${need.id}/listed-voulenteers`}
      className="w-full rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold py-2.5 flex items-center justify-center gap-2 hover:bg-[#245a43] transition"
    >
      See Listed Volunteers
      <ArrowUpRight className="h-4 w-4" />
    </Link>
  )}
</div>
        </div>
      </Card>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 border border-dashed border-[#ece8e0] rounded-2xl bg-white">
      <div className="w-12 h-12 rounded-full bg-[#f4f1ea] flex items-center justify-center text-[#8a9e8c] mb-3">
        <Inbox className="h-5 w-5" />
      </div>
      <p className="text-sm text-[#8a9e8c]">{label}</p>
    </div>
  );
}

export default function MyNeedsClient({activeNeeds,completedNeeds,ngo,}: {
  activeNeeds: NeedItem[];
  completedNeeds: NeedItem[];
  ngo?: {
    ngoName?: string | null;
    city?: string | null;
    type?: string | null;
    isVerified?: boolean;
  } | null;
}) {
  const [tab, setTab] = useState<"active" | "completed">("active");
  const list = tab === "active" ? activeNeeds : completedNeeds;
console.log(activeNeeds);
  return (
    <div className="min-h-screen bg-[#faf8f4] font-['Nunito',sans-serif] text-[#1c2b1e]">
      <NgoTopBar
        ngoName={ngo?.ngoName}
        city={ngo?.city}
        type={ngo?.type}
        isVerified={ngo?.isVerified}
        backHref="/ngo/dashboard"
        backLabel="Dashboard"
      />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-10 py-6 sm:py-10">
        <div className="mb-6 sm:mb-9">
          <div className="text-[0.68rem] sm:text-xs font-bold tracking-[0.1em] text-[#d4890a] uppercase mb-1.5 sm:mb-2">
            Community needs
          </div>
          <h2 className="font-['Playfair_Display',serif] text-[1.4rem] sm:text-[2.1rem] font-bold text-[#1c2b1e] mb-1.5 sm:mb-2">
            Your posted needs
          </h2>
          <p className="text-[0.82rem] sm:text-sm text-[#6b7e6d] max-w-[560px]">
            Select a need to review and act on pending volunteer requests.
          </p>
        </div>

        <div className="inline-flex bg-white border border-[#ece8e0] rounded-xl p-1 mb-6 sm:mb-8">
          <button
            onClick={() => setTab("active")}
            className={`px-4 sm:px-5 py-2 rounded-lg text-[0.82rem] font-bold transition-colors ${
              tab === "active"
                ? "bg-[#2d6a4f] text-white"
                : "text-[#6b7e6d] hover:text-[#1c2b1e]"
            }`}
          >
            Active ({activeNeeds.length})
          </button>
          <button
            onClick={() => setTab("completed")}
            className={`px-4 sm:px-5 py-2 rounded-lg text-[0.82rem] font-bold transition-colors ${
              tab === "completed"
                ? "bg-[#2d6a4f] text-white"
                : "text-[#6b7e6d] hover:text-[#1c2b1e]"
            }`}
          >
            Completed ({completedNeeds.length})
          </button>
        </div>
        {list.length === 0 ? (
          <EmptyState
            label={
              tab === "active"
                ? "No active needs yet. Post one to start receiving volunteers."
                : "No completed needs yet."
            }
          />):(
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {list.map((n) => (
              <NeedCard key={n.id} need={n} isActive={tab === "active"} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}