// app/(volunteer)/needs/NeedsClient.tsx
"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  Inbox,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import NavBar from "@/components/NavBar";
import type { NeedCard } from "./page";

// ── Urgency config (matches homepage + dashboard palette exactly) ──────────
const URGENCY = (level: number) => {
  if (level >= 7) return { label: "High urgency", bg: "bg-[#fde8e8]", text: "text-[#8b1c1c]", dot: "bg-[#c0392b]", bar: "bg-[#c0392b]" };
  if (level >= 4) return { label: "Medium urgency", bg: "bg-[#fff4e0]", text: "text-[#7a4800]", dot: "bg-[#d4890a]", bar: "bg-[#d4890a]" };
  if (level >= 1) return { label: "Low urgency", bg: "bg-[#e6f4ec]", text: "text-[#1b5e38]", dot: "bg-[#2d6a4f]", bar: "bg-[#2d6a4f]" };
  return { label: "Ongoing", bg: "bg-[#f4f1ea]", text: "text-[#6b7e6d]", dot: "bg-[#c8d4ca]", bar: "bg-[#c8d4ca]" };
};

const CATEGORIES = [
  "All", "education", "health", "environment", "animalWelfare",
  "disasterRelief", "povertyAlleviation", "communityDevelopment",
  "artsAndCulture", "humanRights", "other",
];

const CATEGORY_LABELS: Record<string, string> = {
  education: "Education", health: "Health", environment: "Environment",
  animalWelfare: "Animal Welfare", disasterRelief: "Disaster Relief",
  povertyAlleviation: "Poverty Alleviation", communityDevelopment: "Community Dev.",
  artsAndCulture: "Arts & Culture", humanRights: "Human Rights", other: "Other",
};

function CardSlider({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);
  const imgs = images.length > 0 ? images : [];

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIdx((i) => (i - 1 + imgs.length) % imgs.length);
  }, [imgs.length]);

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIdx((i) => (i + 1) % imgs.length);
  }, [imgs.length]);

  if (imgs.length === 0) {
    return (
      <div className="h-[185px] sm:h-[200px] bg-[#f4f1ea] flex items-center justify-center text-[#c8d4ca]">
        <ImageOff className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="relative h-[185px] sm:h-[200px] overflow-hidden group">
      {/* Images */}
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {imgs.map((src, i) => (
          <div key={i} className="relative h-full w-full shrink-0">
            <Image src={src} alt={`${alt} ${i + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>

      {/* Prev/Next — only if >1 image */}
      {imgs.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === idx ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Image count badge */}
      {imgs.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/40 text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full">
          {idx + 1}/{imgs.length}
        </div>
      )}
    </div>
  );
}

// ── Individual need card ──────────────────────────────────────────────────
function NeedCard({ need }: { need: NeedCard }) {
  const u = URGENCY(Number(need.urgencyLevel));
  const max = need.maxVolunteers ?? 0;
  const working = need.voulenteersWorking ?? 0;
  const pct = max > 0 ? Math.min(100, Math.round((working / max) * 100)) : 0;
  const spotsLeft = Math.max(0, max - working);

  return (
    <Link href={`/user/${need.id}`} className="block no-underline group">
      <Card className="border border-[#ece8e0] rounded-2xl overflow-hidden bg-white hover:shadow-[0_12px_36px_rgba(0,0,0,0.09)] hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col">
        <CardSlider images={need.images} alt={need.ProblemCategory} />

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Category + urgency */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <Badge className="bg-[#f4f1ea] text-[#6b7e6d] hover:bg-[#f4f1ea] border-0 text-[0.68rem] font-bold capitalize">
              {CATEGORY_LABELS[need.ProblemCategory] ?? need.ProblemCategory}
            </Badge>
            <div className={`inline-flex items-center gap-[5px] text-[0.68rem] font-bold px-2.5 py-1 rounded-xl ${u.bg} ${u.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${u.dot}`} />
              {u.label}
            </div>
          </div>

          {/* NGO name */}
          <p className="text-xs text-[#8a9e8c] mb-2 truncate">
            {need.ngo.ngoName}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#6b7e6d] mb-3">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#8a9e8c]" />
            <span className="truncate">{need.location}</span>
          </div>

          {/* People affected */}
          {need.peopleAffected != null && (
            <div className="text-xs text-[#8a9e8c] mb-3">
              <span className="font-bold text-[#1c2b1e]">{need.peopleAffected.toLocaleString()}</span> people affected
            </div>
          )}

          {/* Volunteer progress */}
          <div className="mt-auto">
            <div className="flex justify-between text-[0.7rem] text-[#8a9e8c] mb-1.5">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {working} / {max > 0 ? max : "—"} volunteers
              </span>
              {max > 0 && <span>{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left</span>}
            </div>
            {max > 0 && (
              <div className="h-1 bg-[#eae6e0] rounded-full mb-4">
                <div className={`h-full rounded-full transition-all ${u.bar}`} style={{ width: `${pct}%` }} />
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center justify-between">
              <span className="text-[0.78rem] font-bold text-[#2d6a4f] flex items-center gap-1 group-hover:gap-1.5 transition-all">
                View details
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function NeedsClient({ needs }: { needs: NeedCard[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = needs.filter((n) => {
    const matchCat = activeCategory === "All" || n.ProblemCategory === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      n.ProblemCategory.toLowerCase().includes(q) ||
      n.location.toLowerCase().includes(q) ||
      n.ngo.ngoName.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#faf8f4] font-['Nunito',sans-serif] text-[#1c2b1e]">
      <NavBar profile={null} />

      {/* ── Hero strip ── */}

      <main className="max-w-[1280px] mx-auto px-4 sm:px-10 py-8 sm:py-10">
        {/* Category filter pills */}
        <div className="flex gap-2 flex-wrap mb-6 sm:mb-8">
          <SlidersHorizontal className="h-4 w-4 text-[#8a9e8c] self-center shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[0.78rem] font-bold border transition-all ${
                activeCategory === cat
                  ? "bg-[#2d6a4f] text-white border-[#2d6a4f]"
                  : "bg-white text-[#4e6352] border-[#d8e4da] hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
              }`}
            >
              {cat === "All" ? "All needs" : CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>

        {/* Result count */}
        <p className="text-xs text-[#8a9e8c] mb-5">
          Showing <span className="font-bold text-[#1c2b1e]">{filtered.length}</span> {filtered.length === 1 ? "need" : "needs"}
          {activeCategory !== "All" && ` · ${CATEGORY_LABELS[activeCategory] ?? activeCategory}`}
          {search && ` · matching "${search}"`}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#ece8e0] rounded-2xl bg-white">
            <div className="w-12 h-12 rounded-full bg-[#f4f1ea] flex items-center justify-center text-[#8a9e8c] mb-3">
              <Inbox className="h-5 w-5" />
            </div>
            <p className="text-sm text-[#8a9e8c]">No needs match your filters.</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="text-xs font-bold text-[#2d6a4f] mt-2 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((n) => <NeedCard key={n.id} need={n} />)}
          </div>
        )}
      </main>
    </div>
  );
}