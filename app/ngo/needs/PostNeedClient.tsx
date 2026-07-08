// app/ngo/needs/new/PostNeedClient.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  X,
  MapPin,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ImagePlus,
  ChevronRight,
  Info,
  Flame,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import NgoTopBar from "@/components/NgoTopBar";

// ── Types ──────────────────────────────────────────────────────────────────
type NgoProfile = {
  ngoName?: string | null;
  city?: string | null;
  type?: string | null;
  isVerified?: boolean;
} | null;

type UploadedImage = { url: string; publicId: string; preview: string };

const CATEGORIES = [
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "environment", label: "Environment" },
  { value: "animalWelfare", label: "Animal Welfare" },
  { value: "disasterRelief", label: "Disaster Relief" },
  { value: "povertyAlleviation", label: "Poverty Alleviation" },
  { value: "communityDevelopment", label: "Community Dev." },
  { value: "artsAndCulture", label: "Arts & Culture" },
  { value: "humanRights", label: "Human Rights" },
  { value: "other", label: "Other" },
] as const;

const SECTIONS = [
  { id: "overview", label: "Overview", icon: Info },
  { id: "images", label: "Images", icon: ImagePlus },
  { id: "location", label: "Location", icon: MapPin },
  { id: "volunteers", label: "Volunteers", icon: Users },
  { id: "urgency", label: "Urgency", icon: Flame },
  { id: "deadline", label: "Deadline", icon: Calendar },
];

// Urgency level labels
const URGENCY_LABELS: Record<number, { label: string; color: string; bg: string; dot: string }> = {
  0: { label: "No urgency", color: "text-[#6b7e6d]", bg: "bg-[#f4f1ea]", dot: "bg-[#c8d4ca]" },
  1: { label: "Very low", color: "text-[#6b7e6d]", bg: "bg-[#f4f1ea]", dot: "bg-[#c8d4ca]" },
  2: { label: "Low", color: "text-[#1b5e38]", bg: "bg-[#e6f4ec]", dot: "bg-[#2d6a4f]" },
  3: { label: "Low-medium", color: "text-[#1b5e38]", bg: "bg-[#e6f4ec]", dot: "bg-[#2d6a4f]" },
  4: { label: "Medium", color: "text-[#7a4800]", bg: "bg-[#fff4e0]", dot: "bg-[#d4890a]" },
  5: { label: "Medium", color: "text-[#7a4800]", bg: "bg-[#fff4e0]", dot: "bg-[#d4890a]" },
  6: { label: "Medium-high", color: "text-[#7a4800]", bg: "bg-[#fff4e0]", dot: "bg-[#d4890a]" },
  7: { label: "High", color: "text-[#8b1c1c]", bg: "bg-[#fde8e8]", dot: "bg-[#c0392b]" },
  8: { label: "High", color: "text-[#8b1c1c]", bg: "bg-[#fde8e8]", dot: "bg-[#c0392b]" },
  9: { label: "Very high", color: "text-[#8b1c1c]", bg: "bg-[#fde8e8]", dot: "bg-[#c0392b]" },
  10: { label: "Critical", color: "text-[#8b1c1c]", bg: "bg-[#fde8e8]", dot: "bg-[#c0392b]" },
};

// ── Field error helper ─────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-[#8b1c1c] mt-1">
      <AlertTriangle className="h-3 w-3 shrink-0" /> {msg}
    </p>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────
function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-6">
      <div className="mb-4 sm:mb-5">
        <h3 className="font-['Playfair_Display',serif] text-[1.1rem] sm:text-[1.25rem] font-bold text-[#1c2b1e]">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[0.8rem] text-[#6b7e6d] mt-0.5">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Image upload zone ──────────────────────────────────────────────────────
function ImageUploadZone({
  images,
  uploading,
  onAdd,
  onRemove,
  error,
}: {
  images: UploadedImage[];
  uploading: boolean;
  onAdd: (files: FileList) => void;
  onRemove: (idx: number) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length) onAdd(e.dataTransfer.files);
    },
    [onAdd]
  );

  return (
    <div>
      {/* Drop zone — only show when under 5 images */}
      {images.length < 5 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl px-6 py-8 sm:py-10 flex flex-col items-center justify-center cursor-pointer transition-colors mb-4 ${
            dragging
              ? "border-[#2d6a4f] bg-[#e8f5ee]"
              : "border-[#d0e8d8] bg-white hover:border-[#2d6a4f] hover:bg-[#f4faf6]"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#e8f5ee] flex items-center justify-center text-[#2d6a4f] mb-3">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
          </div>
          <p className="text-sm font-bold text-[#1c2b1e] mb-1">
            {uploading ? "Uploading…" : "Drag images here or click to browse"}
          </p>
          <p className="text-xs text-[#8a9e8c]">
            JPEG, PNG, WebP · max 10 MB each · up to {5 - images.length} more
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files && onAdd(e.target.files)}
          />
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
          {images.map((img, i) => (
            <div key={img.publicId} className="relative group aspect-square rounded-xl overflow-hidden">
              <Image src={img.preview} alt={`Upload ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {i === 0 && (
                <div className="absolute bottom-1 left-1">
                  <Badge className="bg-[#2d6a4f] text-white border-0 text-[0.6rem] px-1.5 py-0">
                    Cover
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <FieldError msg={error} />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function PostNeedClient({ ngo }: { ngo: NgoProfile }) {
  const router = useRouter();

  // Form state
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [peopleAffected, setPeopleAffected] = useState("");
  const [maxAffectedPeople, setMaxAffectedPeople] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [maxVolunteers, setMaxVolunteers] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState(5);
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadLine, setDeadLine] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);

  // UI state
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);

  // ── Image upload ──────────────────────────────────────────────────────
  async function handleImageAdd(files: FileList) {
    const remaining = 5 - images.length;
    if (remaining <= 0) return;
    const toUpload = Array.from(files).slice(0, remaining);

    setUploading(true);
    setErrors((e) => ({ ...e, images: "" }));

    const formData = new FormData();
    toUpload.forEach((f) => formData.append("file", f));

    try {
      const res = await fetch("/api/PostingcomunityNeeds/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrors((e) => ({ ...e, images: data.message ?? "Upload failed." }));
        return;
      }

      // Build preview URLs from the local File objects
      const previews = toUpload.map((f) => URL.createObjectURL(f));
      const newImgs: UploadedImage[] = data.images.map(
        (img: { url: string; publicId: string }, i: number) => ({
          url: img.url,
          publicId: img.publicId,
          preview: previews[i],
        })
      );
      setImages((prev) => [...prev, ...newImgs]);
    } catch {
      setErrors((e) => ({ ...e, images: "Upload failed. Please try again." }));
    } finally {
      setUploading(false);
    }
  }

  function handleImageRemove(idx: number) {
    setImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[idx].preview);
      next.splice(idx, 1);
      return next;
    });
  }

  // ── Auto-detect location ───────────────────────────────────────────────
  function detectLocation() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(String(pos.coords.latitude));
        setLongitude(String(pos.coords.longitude));
        setGeoLoading(false);
      },
      () => setGeoLoading(false)
    );
  }

  // ── Validate ───────────────────────────────────────────────────────────
  function validate() {
    const errs: Record<string, string> = {};

    // Required by schema (non-optional)
    if (!description.trim())
      errs.description = "Describe the community problem.";
    if (!category)
      errs.category = "Select a category.";
    if (!location.trim())
      errs.location = "Provide a location or area name.";
    if (hasDeadline && !deadLine)
      errs.deadLine = "Pick a deadline date.";

    // Optional fields — only validate format if the user has entered something
    if (peopleAffected && (isNaN(Number(peopleAffected)) || Number(peopleAffected) < 0))
      errs.peopleAffected = "Enter a valid number.";
    if (maxAffectedPeople && (isNaN(Number(maxAffectedPeople)) || Number(maxAffectedPeople) < 0))
      errs.maxAffectedPeople = "Enter a valid number.";
    if (latitude && isNaN(Number(latitude)))
      errs.latitude = "Enter a valid latitude.";
    if (longitude && isNaN(Number(longitude)))
      errs.longitude = "Enter a valid longitude.";
    if (maxVolunteers && (isNaN(Number(maxVolunteers)) || Number(maxVolunteers) < 1))
      errs.maxVolunteers = "Enter a valid number of volunteers.";

    return errs;
  }

  // ── Submit ─────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      // Scroll to first error
      const firstErrKey = Object.keys(errs)[0];
      const el = document.getElementById(`field-${firstErrKey}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        ProblemDescription: description.trim(),
        ProblemCategory: category,
        location: location.trim(),
        urgencyLevel,
        hasDeadline,
        images: images.map((img) => img.url),
        // Optional — only include when the user filled them in
        ...(peopleAffected ? { peopleAffected: Number(peopleAffected) } : {}),
        ...(maxAffectedPeople ? { maxAffectedPeople: Number(maxAffectedPeople) } : {}),
        ...(latitude ? { latitude: Number(latitude) } : {}),
        ...(longitude ? { longitude: Number(longitude) } : {}),
        ...(maxVolunteers ? { maxVolunteers: Number(maxVolunteers) } : {}),
        ...(hasDeadline && deadLine ? { deadLine } : {}),
      };

      const res = await fetch("/api/PostingcomunityNeeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setApiError(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      setTimeout(() => router.push("/ngo/my-needs"), 2000);
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#faf8f4] font-['Nunito',sans-serif]">
        <NgoTopBar
          ngoName={ngo?.ngoName}
          city={ngo?.city}
          type={ngo?.type}
          isVerified={ngo?.isVerified}
          backHref="/ngo/my-needs"
          backLabel="My needs"
        />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#e8f5ee] flex items-center justify-center text-[#2d6a4f] mb-5">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="font-['Playfair_Display',serif] text-[1.6rem] font-bold text-[#1c2b1e] mb-2">
            Need posted successfully
          </h2>
          <p className="text-sm text-[#6b7e6d] max-w-[380px]">
            Volunteers can now discover and apply to help. Redirecting to your needs…
          </p>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#faf8f4] font-['Nunito',sans-serif] text-[#1c2b1e]">
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: white; border: 2.5px solid #2d6a4f;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15); cursor: pointer;
          transition: transform 0.1s;
        }
        input[type='range']::-webkit-slider-thumb:hover { transform: scale(1.15); }
        input[type='range']::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: white; border: 2.5px solid #2d6a4f;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15); cursor: pointer;
        }
        input[type='range'] { -webkit-appearance: none; appearance: none; }
      `}</style>
      <NgoTopBar
        ngoName={ngo?.ngoName}
        city={ngo?.city}
        type={ngo?.type}
        isVerified={ngo?.isVerified}
        backHref="/ngo/my-needs"
        backLabel="My needs"
      />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-10 py-6 sm:py-10">
        {/* Page header */}
        <div className="mb-6 sm:mb-10">
          <div className="text-[0.68rem] sm:text-xs font-bold tracking-[0.1em] text-[#d4890a] uppercase mb-1.5 sm:mb-2">
            Post a community need
          </div>
          <h2 className="font-['Playfair_Display',serif] text-[1.5rem] sm:text-[2.1rem] font-bold text-[#1c2b1e] mb-1.5 sm:mb-2">
            Describe what your community needs
          </h2>
          <p className="text-[0.82rem] sm:text-sm text-[#6b7e6d] max-w-[520px]">
            Fill in the details below so volunteers can understand the problem, the scale, and how to help.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* ── Sidebar nav — desktop only ── */}
            <aside className="hidden lg:flex flex-col gap-1 w-[200px] shrink-0 sticky top-8">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[0.83rem] font-semibold text-[#6b7e6d] hover:bg-white hover:text-[#1c2b1e] hover:shadow-sm transition-all"
                >
                  <s.icon className="h-4 w-4 shrink-0" />
                  {s.label}
                  <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-40" />
                </a>
              ))}
              <Separator className="my-3 bg-[#ece8e0]" />
              <Button
                type="submit"
                disabled={submitting || uploading}
                className="w-full bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-bold rounded-xl h-10 gap-2"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Posting…</>
                ) : (
                  "Post need"
                )}
              </Button>
            </aside>

            {/* ── Main form area ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-5 sm:gap-6">

              {/* API-level error */}
              {apiError && (
                <div className="flex items-start gap-2.5 bg-[#fde8e8] border border-[#f3c9c9] rounded-xl px-4 py-3.5">
                  <AlertTriangle className="h-4 w-4 text-[#8b1c1c] mt-0.5 shrink-0" />
                  <p className="text-sm text-[#8b1c1c]">{apiError}</p>
                </div>
              )}

              {/* ── SECTION 1: Overview ── */}
              <Card className="border border-[#ece8e0] rounded-2xl p-5 sm:p-7 bg-white">
                <Section
                  id="overview"
                  title="Overview"
                  subtitle="Explain the problem clearly so volunteers understand what's at stake."
                >
                  <div className="flex flex-col gap-4 sm:gap-5">
                    {/* Description */}
                    <div id="field-description">
                      <Label className="text-[0.82rem] font-bold text-[#1c2b1e] mb-1.5 block">
                        Problem description <span className="text-[#c0392b]">*</span>
                      </Label>
                      <Textarea
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          if (errors.description) setErrors((p) => ({ ...p, description: "" }));
                        }}
                        placeholder="Describe the community problem in detail — what's happening, who is affected, and what kind of help is needed…"
                        rows={4}
                        className={`resize-none rounded-xl border text-sm text-[#1c2b1e] placeholder:text-[#a8b8aa] focus-visible:ring-[#2d6a4f] focus-visible:ring-1 ${
                          errors.description ? "border-[#c0392b]" : "border-[#d8e4da]"
                        }`}
                      />
                      <div className="flex items-center justify-between mt-1">
                        <FieldError msg={errors.description} />
                        <span className={`text-xs ml-auto ${description.length < 10 ? "text-[#8a9e8c]" : "text-[#2d6a4f]"}`}>
                          {description.length} chars
                        </span>
                      </div>
                    </div>

                    {/* Category */}
                    <div id="field-category">
                      <Label className="text-[0.82rem] font-bold text-[#1c2b1e] mb-1.5 block">
                        Category <span className="text-[#c0392b]">*</span>
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => {
                              setCategory(c.value);
                              if (errors.category) setErrors((p) => ({ ...p, category: "" }));
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-[0.78rem] font-bold border transition-all ${
                              category === c.value
                                ? "bg-[#2d6a4f] text-white border-[#2d6a4f]"
                                : "bg-white text-[#4e6352] border-[#d8e4da] hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                      <FieldError msg={errors.category} />
                    </div>

                    {/* People affected */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div id="field-peopleAffected">
                        <Label className="text-[0.82rem] font-bold text-[#1c2b1e] mb-1.5 block">
                          People currently affected <span className="text-[#c0392b]">*</span>
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          value={peopleAffected}
                          onChange={(e) => {
                            setPeopleAffected(e.target.value);
                            if (errors.peopleAffected) setErrors((p) => ({ ...p, peopleAffected: "" }));
                          }}
                          placeholder="e.g. 120"
                          className={`rounded-xl border text-sm focus-visible:ring-[#2d6a4f] focus-visible:ring-1 ${
                            errors.peopleAffected ? "border-[#c0392b]" : "border-[#d8e4da]"
                          }`}
                        />
                        <FieldError msg={errors.peopleAffected} />
                      </div>
                      <div id="field-maxAffectedPeople">
                        <Label className="text-[0.82rem] font-bold text-[#1c2b1e] mb-1.5 block">
                          Could affect up to <span className="text-[#c0392b]">*</span>
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          value={maxAffectedPeople}
                          onChange={(e) => {
                            setMaxAffectedPeople(e.target.value);
                            if (errors.maxAffectedPeople) setErrors((p) => ({ ...p, maxAffectedPeople: "" }));
                          }}
                          placeholder="e.g. 500"
                          className={`rounded-xl border text-sm focus-visible:ring-[#2d6a4f] focus-visible:ring-1 ${
                            errors.maxAffectedPeople ? "border-[#c0392b]" : "border-[#d8e4da]"
                          }`}
                        />
                        <FieldError msg={errors.maxAffectedPeople} />
                      </div>
                    </div>
                  </div>
                </Section>
              </Card>

              {/* ── SECTION 2: Images ── */}
              <Card className="border border-[#ece8e0] rounded-2xl p-5 sm:p-7 bg-white">
                <Section
                  id="images"
                  title="Images"
                  subtitle="Add up to 5 photos showing the problem. The first image is the cover."
                >
                  <ImageUploadZone
                    images={images}
                    uploading={uploading}
                    onAdd={handleImageAdd}
                    onRemove={handleImageRemove}
                    error={errors.images}
                  />
                </Section>
              </Card>

              {/* ── SECTION 3: Location ── */}
              <Card className="border border-[#ece8e0] rounded-2xl p-5 sm:p-7 bg-white">
                <Section
                  id="location"
                  title="Location"
                  subtitle="Where is this problem occurring? Be as specific as possible."
                >
                  <div className="flex flex-col gap-4">
                    <div id="field-location">
                      <Label className="text-[0.82rem] font-bold text-[#1c2b1e] mb-1.5 block">
                        Area / landmark name <span className="text-[#c0392b]">*</span>
                      </Label>
                      <Input
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          if (errors.location) setErrors((p) => ({ ...p, location: "" }));
                        }}
                        placeholder="e.g. Rajendra Nagar, Indore"
                        className={`rounded-xl border text-sm focus-visible:ring-[#2d6a4f] focus-visible:ring-1 ${
                          errors.location ? "border-[#c0392b]" : "border-[#d8e4da]"
                        }`}
                      />
                      <FieldError msg={errors.location} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div id="field-latitude">
                        <Label className="text-[0.82rem] font-bold text-[#1c2b1e] mb-1.5 block">
                          Latitude <span className="text-[#c0392b]">*</span>
                        </Label>
                        <Input
                          type="number"
                          step="any"
                          value={latitude}
                          onChange={(e) => {
                            setLatitude(e.target.value);
                            if (errors.latitude) setErrors((p) => ({ ...p, latitude: "" }));
                          }}
                          placeholder="e.g. 22.7196"
                          className={`rounded-xl border text-sm focus-visible:ring-[#2d6a4f] focus-visible:ring-1 ${
                            errors.latitude ? "border-[#c0392b]" : "border-[#d8e4da]"
                          }`}
                        />
                        <FieldError msg={errors.latitude} />
                      </div>
                      <div id="field-longitude">
                        <Label className="text-[0.82rem] font-bold text-[#1c2b1e] mb-1.5 block">
                          Longitude <span className="text-[#c0392b]">*</span>
                        </Label>
                        <Input
                          type="number"
                          step="any"
                          value={longitude}
                          onChange={(e) => {
                            setLongitude(e.target.value);
                            if (errors.longitude) setErrors((p) => ({ ...p, longitude: "" }));
                          }}
                          placeholder="e.g. 75.8577"
                          className={`rounded-xl border text-sm focus-visible:ring-[#2d6a4f] focus-visible:ring-1 ${
                            errors.longitude ? "border-[#c0392b]" : "border-[#d8e4da]"
                          }`}
                        />
                        <FieldError msg={errors.longitude} />
                      </div>
                    </div>

                    {/* Detect location button */}
                    <button
                      type="button"
                      onClick={detectLocation}
                      disabled={geoLoading}
                      className="inline-flex items-center gap-2 text-[0.78rem] font-bold text-[#2d6a4f] hover:text-[#1b4332] transition-colors self-start"
                    >
                      {geoLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <MapPin className="h-3.5 w-3.5" />
                      )}
                      {geoLoading ? "Detecting…" : "Use my current location"}
                    </button>
                  </div>
                </Section>
              </Card>

              {/* ── SECTION 4: Volunteers ── */}
              <Card className="border border-[#ece8e0] rounded-2xl p-5 sm:p-7 bg-white">
                <Section
                  id="volunteers"
                  title="Volunteers needed"
                  subtitle="How many volunteers are required to address this need?"
                >
                  <div id="field-maxVolunteers" className="max-w-[240px]">
                    <Label className="text-[0.82rem] font-bold text-[#1c2b1e] mb-1.5 block">
                      Maximum volunteers <span className="text-[#c0392b]">*</span>
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={maxVolunteers}
                      onChange={(e) => {
                        setMaxVolunteers(e.target.value);
                        if (errors.maxVolunteers) setErrors((p) => ({ ...p, maxVolunteers: "" }));
                      }}
                      placeholder="e.g. 20"
                      className={`rounded-xl border text-sm focus-visible:ring-[#2d6a4f] focus-visible:ring-1 ${
                        errors.maxVolunteers ? "border-[#c0392b]" : "border-[#d8e4da]"
                      }`}
                    />
                    <FieldError msg={errors.maxVolunteers} />
                  </div>
                </Section>
              </Card>

              {/* ── SECTION 5: Urgency ── */}
              <Card className="border border-[#ece8e0] rounded-2xl p-5 sm:p-7 bg-white">
                <Section
                  id="urgency"
                  title="Urgency level"
                  subtitle="Rate how urgently this need must be addressed. This affects how your need is ranked for volunteers."
                >
                  <div className="flex flex-col gap-5">
                    {/* Badge + number display */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[0.82rem] font-bold ${URGENCY_LABELS[urgencyLevel].bg} ${URGENCY_LABELS[urgencyLevel].color}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${URGENCY_LABELS[urgencyLevel].dot}`} />
                        {URGENCY_LABELS[urgencyLevel].label}
                      </div>
                      <span className="font-['Playfair_Display',serif] text-[1.6rem] font-bold text-[#1c2b1e] leading-none">
                        {urgencyLevel}
                        <span className="text-[#8a9e8c] text-sm font-['Nunito',sans-serif] font-normal">/10</span>
                      </span>
                    </div>

                    {/* Slider */}
                    <div className="px-1">
                      <input
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        value={urgencyLevel}
                        onChange={(e) => setUrgencyLevel(Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${
                            urgencyLevel <= 3
                              ? "#2d6a4f"
                              : urgencyLevel <= 6
                              ? "#d4890a"
                              : "#c0392b"
                          } 0%, ${
                            urgencyLevel <= 3
                              ? "#2d6a4f"
                              : urgencyLevel <= 6
                              ? "#d4890a"
                              : "#c0392b"
                          } ${urgencyLevel * 10}%, #eae6e0 ${urgencyLevel * 10}%, #eae6e0 100%)`,
                        }}
                      />
                      {/* Tick labels */}
                      <div className="flex justify-between mt-2 px-0.5">
                        {[0, 2, 4, 6, 8, 10].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setUrgencyLevel(n)}
                            className={`text-[0.65rem] font-bold transition-colors ${
                              urgencyLevel === n ? "text-[#1c2b1e]" : "text-[#c8d4ca] hover:text-[#8a9e8c]"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Contextual hint */}
                    <div className="grid grid-cols-3 gap-2 text-[0.72rem]">
                      <div className="flex items-center gap-1.5 text-[#1b5e38]">
                        <span className="w-2 h-2 rounded-full bg-[#2d6a4f] shrink-0" />
                        1–3 · Ongoing, not time-critical
                      </div>
                      <div className="flex items-center gap-1.5 text-[#7a4800]">
                        <span className="w-2 h-2 rounded-full bg-[#d4890a] shrink-0" />
                        4–6 · Needs attention soon
                      </div>
                      <div className="flex items-center gap-1.5 text-[#8b1c1c]">
                        <span className="w-2 h-2 rounded-full bg-[#c0392b] shrink-0" />
                        7–10 · Urgent, act fast
                      </div>
                    </div>
                  </div>
                </Section>
              </Card>

              {/* ── SECTION 6: Deadline ── */}
              <Card className="border border-[#ece8e0] rounded-2xl p-5 sm:p-7 bg-white">
                <Section
                  id="deadline"
                  title="Deadline"
                  subtitle="Set a date if this need must be addressed by a specific time."
                >
                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      setHasDeadline((v) => !v);
                      if (errors.deadLine) setErrors((p) => ({ ...p, deadLine: "" }));
                    }}
                    className="flex items-center gap-3 mb-4 group"
                  >
                    <div
                      className={`w-10 h-5.5 sm:w-11 sm:h-6 rounded-full relative transition-colors ${
                        hasDeadline ? "bg-[#2d6a4f]" : "bg-[#d0e0d4]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow transition-transform ${
                          hasDeadline ? "translate-x-4 sm:translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                    <span className="text-[0.82rem] font-bold text-[#1c2b1e]">
                      {hasDeadline ? "Deadline set" : "This need has a deadline"}
                    </span>
                  </button>

                  {hasDeadline && (
                    <div id="field-deadLine" className="max-w-[240px]">
                      <Label className="text-[0.82rem] font-bold text-[#1c2b1e] mb-1.5 block">
                        Deadline date <span className="text-[#c0392b]">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={deadLine}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                          setDeadLine(e.target.value);
                          if (errors.deadLine) setErrors((p) => ({ ...p, deadLine: "" }));
                        }}
                        className={`rounded-xl border text-sm focus-visible:ring-[#2d6a4f] focus-visible:ring-1 ${
                          errors.deadLine ? "border-[#c0392b]" : "border-[#d8e4da]"
                        }`}
                      />
                      <FieldError msg={errors.deadLine} />
                    </div>
                  )}
                </Section>
              </Card>

              {/* ── Mobile submit ── */}
              <div className="lg:hidden">
                {apiError && (
                  <div className="flex items-start gap-2.5 bg-[#fde8e8] border border-[#f3c9c9] rounded-xl px-4 py-3.5 mb-4">
                    <AlertTriangle className="h-4 w-4 text-[#8b1c1c] mt-0.5 shrink-0" />
                    <p className="text-sm text-[#8b1c1c]">{apiError}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={submitting || uploading}
                  className="w-full bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-bold rounded-xl h-12 text-[0.95rem] gap-2"
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Posting…</>
                  ) : (
                    "Post community need"
                  )}
                </Button>
                <p className="text-xs text-[#8a9e8c] text-center mt-2.5">
                  Volunteers will be able to find and apply for this need immediately.
                </p>
              </div>

            </div>
          </div>
        </form>
      </main>
    </div>
  );
}