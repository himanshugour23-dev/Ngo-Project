"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {MapPin,Users,Calendar,Clock,ChevronLeft,ChevronRight,CheckCircle2,AlertTriangle,ImageOff,ArrowLeft,Loader2,Building2,Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NavBar from "@/components/NavBar";
import type { NeedDetail } from "./page";

// ── Urgency config ────────────────────────────────────────────────────────
const URGENCY = (level: number) => {
  if (level >= 7)
    return { label: "High urgency", bg: "bg-[#fde8e8]", text: "text-[#8b1c1c]", dot: "bg-[#c0392b]", bar: "bg-[#c0392b]" };
  if (level >= 4)
    return { label: "Medium urgency", bg: "bg-[#fff4e0]", text: "text-[#7a4800]", dot: "bg-[#d4890a]", bar: "bg-[#d4890a]" };
  if (level >= 1)
    return { label: "Low urgency", bg: "bg-[#e6f4ec]", text: "text-[#1b5e38]", dot: "bg-[#2d6a4f]", bar: "bg-[#2d6a4f]" };
  return { label: "Ongoing", bg: "bg-[#f4f1ea]", text: "text-[#6b7e6d]", dot: "bg-[#c8d4ca]", bar: "bg-[#c8d4ca]" };
};

const CATEGORY_LABELS: Record<string, string> = {
  education: "Education", health: "Health", environment: "Environment",
  animalWelfare: "Animal Welfare", disasterRelief: "Disaster Relief",
  povertyAlleviation: "Poverty Alleviation", communityDevelopment: "Community Development",
  artsAndCulture: "Arts & Culture", humanRights: "Human Rights", other: "Other",
};

function formatDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function ImageSlider({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error" | "already">("idle");
  const [msg, setMsg] = useState("");
  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Touch / drag swipe
  function onPointerDown(e: React.PointerEvent) {
    setDragging(true);
    setDragStart(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!dragging) return;
    const delta = e.clientX - dragStart;
    if (delta < -40) next();
    else if (delta > 40) prev();
    setDragging(false);
  }

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[16/9] sm:aspect-[21/9] bg-[#f4f1ea] rounded-2xl flex items-center justify-center text-[#c8d4ca]">
        <ImageOff className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main viewer */}
      <div
        className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-black select-none"
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      >
        {/* Slide strip */}
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {images.map((src, i) => (
            <div key={i} className="relative h-full w-full shrink-0">
              <Image
                src={src}
                alt={`Image ${i + 1}`}
                fill
                className="object-contain"
                draggable={false}
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Gradient overlays for nav buttons */}
        {images.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />

            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Counter pill */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
            {idx + 1} / {images.length}
          </div>
        )}

        {/* Dot indicators (bottom center) */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  i === idx
                    ? "w-5 h-2 bg-white"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip — shown when 2+ images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                i === idx
                  ? "border-[#2d6a4f] opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={src} alt={`Thumb ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Apply button with state ───────────────────────────────────────────────
function ApplyButton({ needId }: { needId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error" | "already">("idle");
  const [msg, setMsg] = useState("");
  useEffect(() => {
  async function checkApplicationStatus() {
    try {
      const res = await fetch(`/api/communityNeeds/${needId}/apply-status`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.alreadyApplied) {
        setState("already");
        setMsg(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  }
  checkApplicationStatus();
}, [needId]);
  async function handleApply() {
  if (state === "loading" ||state === "success" ||state === "already") {
    return;
  }
    setState("loading");
    setMsg("");

    try {
      const res = await fetch(`/api/communityNeeds/${needId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ needId }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setState("already");
        setMsg(data.message ?? "You have already applied for this need.");
        return;
      }
      if (!res.ok) {
        setState("error");
        setMsg(data.message ?? "Something went wrong. Please try again.");
        return;
      }
      setState("success");
      setMsg("Application submitted! The NGO will review your request.");
    } catch {
      setState("error");
      setMsg("Network error. Please check your connection and try again.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleApply}
        disabled={state === "loading" || state === "success" || state === "already"}
        className={`w-full h-12 text-[0.95rem] font-bold rounded-xl gap-2 transition-all ${
          state === "success"
            ? "bg-[#2d6a4f] hover:bg-[#2d6a4f] text-white"
            : state === "already"
            ? "bg-[#f4f1ea] text-[#6b7e6d] hover:bg-[#f4f1ea]"
            : state === "error"
            ? "bg-[#c0392b] hover:bg-[#a93226] text-white"
            : "bg-[#2d6a4f] hover:bg-[#1b4332] text-white"
        }`}
      >
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        {state === "success" && <CheckCircle2 className="h-4 w-4" />}
        {state === "already" && <CheckCircle2 className="h-4 w-4" />}
        {state === "error" && <AlertTriangle className="h-4 w-4" />}
        {state === "idle" && "Apply to serve this need"}
        {state === "loading" && "Submitting…"}
        {state === "success" && "Application submitted!"}
        {state === "already" && "Already applied"}
        {state === "error" && "Try again"}
      </Button>

      {msg && (
        <p className={`text-xs text-center leading-relaxed ${
          state === "success" ? "text-[#1b5e38]" :
          state === "already" ? "text-[#6b7e6d]" :
          "text-[#8b1c1c]"
        }`}>
          {msg}
        </p>
      )}
    </div>
  );
}

// ── Stat row helper ───────────────────────────────────────────────────────
function StatRow({icon,label,value,valueClass = "text-[#1c2b1e]",}: {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#f4f1ea] flex items-center justify-center text-[#8a9e8c] shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <div className="text-[0.68rem] font-bold uppercase tracking-wide text-[#8a9e8c] mb-0.5">
          {label}
        </div>
        <div className={`text-sm font-semibold ${valueClass}`}>{value}</div>
      </div>
    </div>
  );
}

// ── Error / not-found state ───────────────────────────────────────────────
function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-[#faf8f4] font-['Nunito',sans-serif]">
      <NavBar profile={null} />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] px-4 text-center">
        <div className="w-14 h-14 rounded-full bg-[#fde8e8] flex items-center justify-center text-[#8b1c1c] mb-4">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="font-['Playfair_Display',serif] text-[1.4rem] font-bold text-[#1c2b1e] mb-2">
          {message}
        </h2>
        <Link href="/user/availableNeeds">
          <Button className="mt-4 bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-bold rounded-xl gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to needs
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ── Main page component ───────────────────────────────────────────────────
export default function NeedDetailClient({
  need,
  error,
}: {
  need: NeedDetail | null;
  error: string | null;
}) {
  if (!need || error) return <ErrorState message={error ?? "Need not found."} />;

  const u = URGENCY(Number(need.urgencyLevel));
  const max = need.maxVolunteers ?? 0;
  const working = need.voulenteersWorking ?? 0;
  const pct = max > 0 ? Math.min(100, Math.round((working / max) * 100)) : 0;
  const spotsLeft = Math.max(0, max - working);
  const isFull = max > 0 && spotsLeft === 0;

  return (
    <div className="min-h-screen bg-[#faf8f4] font-['Nunito',sans-serif] text-[#1c2b1e]">
      <NavBar profile={null} />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-10 py-6 sm:py-10">
        {/* Back link */}
        <Link
          href="/user/availableNeeds"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6b7e6d] hover:text-[#2d6a4f] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          All community needs
        </Link>

        <div className="flex flex-col lg:flex-row gap-7 lg:gap-10 items-start">
          {/* ── Left column: images + description ── */}
          <div className="flex-1 min-w-0">
            {/* Image slider */}
            <ImageSlider images={need.images} />

            {/* Category + urgency row */}
            <div className="flex flex-wrap items-center gap-2.5 mt-5 mb-4">
              <Badge className="bg-[#f4f1ea] text-[#6b7e6d] hover:bg-[#f4f1ea] border-0 text-[0.75rem] font-bold capitalize px-3 py-1">
                {CATEGORY_LABELS[need.ProblemCategory] ?? need.ProblemCategory}
              </Badge>
              <div className={`inline-flex items-center gap-[5px] text-[0.75rem] font-bold px-3 py-1 rounded-xl ${u.bg} ${u.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${u.dot}`} />
                {u.label} · {need.urgencyLevel}/10
              </div>
              {need.status === "resolved" && (
                <Badge className="bg-[#e6f4ec] text-[#1b5e38] hover:bg-[#e6f4ec] border-0 text-[0.75rem] font-bold px-3 py-1">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Resolved
                </Badge>
              )}
            </div>

            {/* Description card */}
            <Card className="border border-[#ece8e0] rounded-2xl p-5 sm:p-7 bg-white mb-5">
              <div className="text-xs font-bold tracking-[0.1em] text-[#d4890a] uppercase mb-3">
                About this need
              </div>
              <p className="text-[0.92rem] text-[#4e6352] leading-[1.8] whitespace-pre-line">
                {need.ProblemDescription}
              </p>
            </Card>

            {/* Stats grid */}
            <Card className="border border-[#ece8e0] rounded-2xl p-5 sm:p-7 bg-white">
              <div className="text-xs font-bold tracking-[0.1em] text-[#d4890a] uppercase mb-4">
                Need details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <StatRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={need.location}
                />
                {need.peopleAffected != null && (
                  <StatRow
                    icon={<Activity className="h-4 w-4" />}
                    label="People affected"
                    value={`${need.peopleAffected.toLocaleString()}${need.maxAffectedPeople ? ` (up to ${need.maxAffectedPeople.toLocaleString()})` : ""}`}
                  />
                )}
                <StatRow
                  icon={<Users className="h-4 w-4" />}
                  label="Volunteers"
                  value={
                    <span>
                      <span className="font-bold text-[#2d6a4f]">{working}</span>
                      {max > 0 && (
                        <span className="text-[#8a9e8c]"> / {max} filled</span>
                      )}
                    </span>
                  }
                />
                {need.hasDeadline && need.deadLine && (
                  <StatRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Deadline"
                    value={formatDate(need.deadLine) ?? "—"}
                    valueClass="text-[#8b1c1c]"
                  />
                )}
                <StatRow
                  icon={<Clock className="h-4 w-4" />}
                  label="Posted"
                  value={formatDate(need.createdAt) ?? "—"}
                />
                {need.latitude != null && need.longitude != null && (
                  <StatRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="Coordinates"
                    value={
                      <a
                        href={`https://maps.google.com/?q=${need.latitude},${need.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2d6a4f] hover:underline"
                      >
                        {need.latitude.toFixed(4)}, {need.longitude.toFixed(4)}
                      </a>
                    }
                  />
                )}
              </div>
            </Card>
          </div>

          {/* ── Right sidebar: apply + NGO info ── */}
          <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-4 lg:sticky lg:top-8">

            {/* Apply card */}
            <Card className="border border-[#ece8e0] rounded-2xl p-5 sm:p-6 bg-white">
              {/* Volunteer progress */}
              {max > 0 && (
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-[#8a9e8c] mb-1.5">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {working} / {max} volunteers joined
                    </span>
                    <span className={isFull ? "text-[#8b1c1c] font-bold" : ""}>
                      {isFull ? "Full" : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`}
                    </span>
                  </div>
                  <div className="h-2 bg-[#eae6e0] rounded-full">
                    <div
                      className={`h-full rounded-full transition-all ${u.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[0.68rem] text-[#8a9e8c] mt-1.5 text-right">
                    {pct}% filled
                  </div>
                </div>
              )}

              {/* Urgency pill */}
              <div className={`flex items-center gap-2 text-sm font-bold mb-4 px-3 py-2.5 rounded-xl ${u.bg} ${u.text}`}>
                <span className={`w-2 h-2 rounded-full ${u.dot}`} />
                {u.label} · urgency {need.urgencyLevel}/10
              </div>

              {need.status === "resolved" ? (
                <div className="flex items-center gap-2 bg-[#e6f4ec] text-[#1b5e38] text-sm font-bold px-4 py-3 rounded-xl">
                  <CheckCircle2 className="h-4 w-4" />
                  This need has been resolved
                </div>
              ) : isFull ? (
                <div className="flex items-center gap-2 bg-[#fde8e8] text-[#8b1c1c] text-sm font-bold px-4 py-3 rounded-xl">
                  <AlertTriangle className="h-4 w-4" />
                  All volunteer spots are filled
                </div>
              ) : (
                <ApplyButton needId={need.id} />
              )}

              <p className="text-xs text-[#8a9e8c] text-center mt-3 leading-relaxed">
                Your application will be reviewed by the NGO before you are confirmed.
              </p>
            </Card>

            {/* NGO info card */}
            <Card className="border border-[#ece8e0] rounded-2xl p-5 sm:p-6 bg-white">
              <div className="text-xs font-bold tracking-[0.1em] text-[#d4890a] uppercase mb-4">
                Posted by
              </div>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-[#1b5e38] font-bold text-sm shrink-0">
                  {need.ngo.ngoName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#1c2b1e] truncate">
                    {need.ngo.ngoName}
                  </div>
                  {need.ngo.city && (
                    <div className="text-xs text-[#8a9e8c] flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {need.ngo.city}
                    </div>
                  )}
                </div>
              </div>

              {need.ngo.isVerified && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1b5e38] bg-[#e8f5ee] px-3 py-2 rounded-lg">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified NGO
                </div>
              )}

              <Separator className="my-3 bg-[#ece8e0]" />

              <div className="flex items-center gap-2 text-xs text-[#8a9e8c]">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span>Admin-verified organization</span>
              </div>
            </Card>

            {/* Deadline warning if close */}
            {need.hasDeadline && need.deadLine && (() => {
              const daysLeft = Math.ceil(
                (new Date(need.deadLine).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              if (daysLeft > 7 || daysLeft < 0) return null;
              return (
                <div className="flex items-start gap-2.5 bg-[#fff4e0] border border-[#f0d8a8] rounded-2xl px-4 py-3.5">
                  <AlertTriangle className="h-4 w-4 text-[#d4890a] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#7a4800]">
                    <span className="font-bold">Deadline in {daysLeft} day{daysLeft !== 1 ? "s" : ""}.</span>{" "}
                    Apply soon to be considered.
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}