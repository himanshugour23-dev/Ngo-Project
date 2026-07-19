// app/ngo/dashboard/DashboardClient.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {AlertTriangle,CheckCircle2,Clock,Users,ArrowUpRight,MapPin,Calendar,Sparkles,Plus,Building2,LogOut,Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
type Ngo = {
  id: string;
  ngoName: string;
  email: string;
  isVerified: boolean;
  city: string | null;
  Address: string | null;
  type: string | null;
  motto: string | null;
  yearOfEstablishment: number | null;
} | null;

type Dashboard = {
  activeNeeds: number;
  completedNeeds: number;
  pendingRequests: number;
  volunteersWorking: number;
};

export default function DashboardClient({ngo,dashboard,}: {
  ngo: Ngo;
  dashboard: Dashboard; }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const initials =
    ngo?.ngoName
      ?.split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() ?? "NG";

  const totalNeeds = dashboard.activeNeeds + dashboard.completedNeeds;
  const completionRate =
    totalNeeds > 0 ? Math.round((dashboard.completedNeeds / totalNeeds) * 100) : 0;

  const profileFields: [string, unknown][] = [
    ["name", ngo?.ngoName],
    ["city", ngo?.city],
    ["address", ngo?.Address],
    ["type", ngo?.type],
    ["motto", ngo?.motto],
    ["year", ngo?.yearOfEstablishment],
  ];
  const filledFields = profileFields.filter(([, v]) => Boolean(v)).length;
  const profileCompletion = Math.round((filledFields / profileFields.length) * 100);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const res = await fetch("/api/ngo/logout", { method: "POST" });
      if (res.ok) {
        router.push("/ngo-login");
        router.refresh();
      } else {
        setLoggingOut(false);
      }
    } catch {
      setLoggingOut(false);
    }
  }

  const cards: {key: string;label: string;value: number;href: string;icon: ReactNode;accentBg: string;accentText: string;accentDot: string;barBg: string;description: string;cta: string;showBar?: boolean;barPct?: number;
  }[] = [
    {
      key: "active",
      label: "Active needs",
      value: dashboard.activeNeeds,
      href: "/ngo/my-needs",
      icon: <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />,
      accentBg: "bg-[#fde8e8]",
      accentText: "text-[#8b1c1c]",
      accentDot: "bg-[#c0392b]",
      barBg: "bg-[#c0392b]",
      description: "Needs currently open for volunteers",
      cta: "View active needs",
    },
    {
      key: "pending",
      label: "Pending requests",
      value: dashboard.pendingRequests,
      href: "/ngo/my-needs",
      icon: <Clock className="h-4 w-4 sm:h-5 sm:w-5" />,
      accentBg: "bg-[#fff4e0]",
      accentText: "text-[#7a4800]",
      accentDot: "bg-[#d4890a]",
      barBg: "bg-[#d4890a]",
      description: "Volunteer applications awaiting approval",
      cta: "Review requests",
    },
    {
      key: "volunteers",
      label: "View volunteers which are Active",
      value: dashboard.volunteersWorking,
      href: "/ngo/volunteers",
      icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />,
      accentBg: "bg-[#e6f0fb]",
      accentText: "text-[#1c3f73]",
      accentDot: "bg-[#3568b8]",
      barBg: "bg-[#3568b8]",
      description: "see volunteers which are currently active and looking for work ",
      cta: "See volunteer roster",
    },
    {
      key: "completed",
      label: "Completed needs",
      value: dashboard.completedNeeds,
      href: "/ngo/needs?status=resolved",
      icon: <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />,
      accentBg: "bg-[#e6f4ec]",
      accentText: "text-[#1b5e38]",
      accentDot: "bg-[#2d6a4f]",
      barBg: "bg-[#2d6a4f]",
      description: "Resolved and closed out successfully",
      cta: "View history",
      showBar: true,
      barPct: completionRate,
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f4] font-['Nunito',sans-serif] text-[#1c2b1e]">

      <div className="border-b border-[#ece8e0] bg-white px-4 sm:px-10 py-3.5 sm:py-5">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-[#1b5e38] font-bold text-xs sm:text-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[0.85rem] sm:text-[0.95rem] font-bold text-[#1c2b1e] truncate">
                  {ngo?.ngoName ?? "Your NGO"}
                </h1>
                {ngo?.isVerified ? (
                  <Badge className="hidden sm:inline-flex bg-[#e8f5ee] text-[#1b5e38] hover:bg-[#e8f5ee] border-0 text-[0.65rem] font-bold px-2 py-0 gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </Badge>
                ) : (
                  <Badge className="hidden sm:inline-flex bg-[#fff4e0] text-[#7a4800] hover:bg-[#fff4e0] border-0 text-[0.65rem] font-bold px-2 py-0">
                    Pending verification
                  </Badge>
                )}
              </div>
              <p className="text-[0.72rem] sm:text-xs text-[#8a9e8c] truncate">
                {ngo?.city ?? "Location not set"} ·{" "}
                {ngo?.type ?? "NGO"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/ngo/needs/new">
              <Button className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-bold rounded-xl px-3.5 sm:px-5 h-9 sm:h-10 text-[0.8rem] sm:text-sm gap-1.5 sm:gap-2">
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Post a need</span>
                <span className="sm:hidden">Post</span>
              </Button>
            </Link>

            <Button
              onClick={handleLogout}
              disabled={loggingOut}
              variant="outline"
              className="border-[#ece8e0] text-[#6b7e6d] hover:bg-[#fde8e8] hover:text-[#8b1c1c] hover:border-[#f3c9c9] rounded-xl h-9 sm:h-10 w-9 sm:w-10 p-0 gap-0"
              aria-label="Log out"
            >
              {loggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-4 sm:px-10 py-6 sm:py-10">

        <div className="mb-5 sm:mb-9">
          <div className="text-[0.68rem] sm:text-xs font-bold tracking-[0.1em] text-[#d4890a] uppercase mb-1.5 sm:mb-2">
            Dashboard
          </div>
          <h2 className="font-['Playfair_Display',serif] text-[1.4rem] sm:text-[2.1rem] font-bold text-[#1c2b1e] mb-1.5 sm:mb-2">
            Welcome back{ngo?.ngoName ? `, ${ngo.ngoName}` : ""}
          </h2>
          <p className="text-[0.82rem] sm:text-sm text-[#6b7e6d] max-w-[560px]">
            Here&apos;s what&apos;s happening across your community needs right now.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-10">
          {cards.map((c) => (
            <Card
              key={c.key}
              onClick={() => router.push(c.href)}
              className="group relative border border-[#ece8e0] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 cursor-pointer bg-white hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-2.5 sm:mb-4">
                <div
                  className={`w-8 h-8 sm:w-11 sm:h-11 rounded-[9px] sm:rounded-[12px] ${c.accentBg} ${c.accentText} flex items-center justify-center`}
                >
                  {c.icon}
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#c8d4ca] group-hover:text-[#2d6a4f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div className="font-['Playfair_Display',serif] text-[1.5rem] sm:text-[2.2rem] font-bold text-[#1c2b1e] leading-none mb-0.5 sm:mb-1">
                {c.value}
              </div>
              <div className="text-[0.72rem] sm:text-[0.85rem] font-bold text-[#1c2b1e] mb-1 leading-tight">
                {c.label}
              </div>
              <div className="hidden sm:block text-xs text-[#8a9e8c] leading-[1.5] mb-4 min-h-[32px]">
                {c.description}
              </div>

              {c.showBar && (
                <div className="mb-2.5 sm:mb-4">
                  <div className="flex justify-between text-[0.62rem] sm:text-[0.68rem] text-[#8a9e8c] mb-1 sm:mb-1.5">
                    <span className="hidden sm:inline">Completion rate</span>
                    <span className="sm:hidden">Done</span>
                    <span>{c.barPct}%</span>
                  </div>
                  <div className="h-1 bg-[#eae6e0] rounded-full">
                    <div
                      className={`h-full rounded-full ${c.barBg}`}
                      style={{ width: `${c.barPct}%` }}
                    />
                  </div>
                </div>
              )}

              <div
                className={`hidden sm:flex items-center gap-1.5 text-[0.78rem] font-bold ${c.accentText} opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                {c.cta} <ArrowUpRight className="h-3 w-3" />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.85fr_0.85fr] gap-4 sm:gap-6">
          <Card className="border border-[#ece8e0] rounded-2xl p-5 sm:p-7 bg-white">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#d4890a]" />
                <span className="text-xs font-bold tracking-[0.1em] text-[#d4890a] uppercase">
                  Organization profile
                </span>
              </div>
              <Link href="/ngo/profile/edit">
                <Button
                  variant="outline"
                  className="border-[#2d6a4f] text-[#2d6a4f] hover:bg-[#2d6a4f] hover:text-white rounded-lg text-xs font-bold h-8 px-3"
                >
                  Edit profile
                </Button>
              </Link>
            </div>

            {ngo?.motto && (
              <p className="font-['Playfair_Display',serif] text-[1rem] sm:text-[1.05rem] italic text-[#1c2b1e] leading-[1.5] mb-4 sm:mb-5 border-l-4 border-[#2d6a4f] pl-4">
                &quot;{ngo.motto}&quot;
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#8a9e8c] mt-0.5 shrink-0" />
                <div>
                  <div className="text-[0.68rem] font-bold uppercase tracking-wide text-[#8a9e8c] mb-0.5">
                    Address
                  </div>
                  <div className="text-sm text-[#1c2b1e]">
                    {ngo?.Address ?? "Not provided"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-[#8a9e8c] mt-0.5 shrink-0" />
                <div>
                  <div className="text-[0.68rem] font-bold uppercase tracking-wide text-[#8a9e8c] mb-0.5">
                    Type
                  </div>
                  <div className="text-sm text-[#1c2b1e]">{ngo?.type ?? "Not provided"}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-[#8a9e8c] mt-0.5 shrink-0" />
                <div>
                  <div className="text-[0.68rem] font-bold uppercase tracking-wide text-[#8a9e8c] mb-0.5">
                    Established
                  </div>
                  <div className="text-sm text-[#1c2b1e]">
                    {ngo?.yearOfEstablishment ?? "Not provided"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building2 className="h-4 w-4 text-[#8a9e8c] mt-0.5 shrink-0" />
                <div>
                  <div className="text-[0.68rem] font-bold uppercase tracking-wide text-[#8a9e8c] mb-0.5">
                    Email
                  </div>
                  <div className="text-sm text-[#1c2b1e] truncate">{ngo?.email}</div>
                </div>
              </div>
            </div>

            <Separator className="my-4 sm:my-5 bg-[#ece8e0]" />

            <div>
              <div className="flex justify-between text-xs text-[#8a9e8c] mb-1.5">
                <span>Profile completeness</span>
                <span className="font-bold text-[#1c2b1e]">{profileCompletion}%</span>
              </div>
              <div className="h-1.5 bg-[#eae6e0] rounded-full">
                <div
                  className="h-full rounded-full bg-[#d4890a]"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              {profileCompletion < 100 && (
                <p className="text-xs text-[#8a9e8c] mt-2">
                  A complete profile builds trust with volunteers reviewing your needs.
                </p>
              )}
            </div>
          </Card>

          
          <Card className="border border-[#ece8e0] rounded-2xl p-5 sm:p-7 bg-white">
            <div className="text-xs font-bold tracking-[0.1em] text-[#d4890a] uppercase mb-4 sm:mb-5">
              Quick actions
            </div>

            <div className="flex flex-col gap-2.5">
              <Link href="/ngo/needs/new" className="block">
                <button className="w-full flex items-center justify-between gap-3 rounded-xl border border-[#ece8e0] hover:border-[#2d6a4f] hover:bg-[#f4faf6] px-4 py-3 text-left transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#e8f5ee] text-[#1b5e38] flex items-center justify-center">
                      <Plus className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-[#1c2b1e]">Post a new need</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#c8d4ca]" />
                </button>
              </Link>

              <Link href="/ngo/my-needs" className="block">
                <button className="w-full flex items-center justify-between gap-3 rounded-xl border border-[#ece8e0] hover:border-[#d4890a] hover:bg-[#fffaf0] px-4 py-3 text-left transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#fff4e0] text-[#7a4800] flex items-center justify-center">
                      <Clock className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-[#1c2b1e]">Review pending requests</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#c8d4ca]" />
                </button>
              </Link>

              <Link href="/ngo/volunteers" className="block">
                <button className="w-full flex items-center justify-between gap-3 rounded-xl border border-[#ece8e0] hover:border-[#3568b8] hover:bg-[#f4f8fd] px-4 py-3 text-left transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#e6f0fb] text-[#1c3f73] flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-[#1c2b1e]">View volunteers which are Active</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#c8d4ca]" />
                </button>
              </Link>

              <Link href="/ngo/my-needs" className="block">
                <button className="w-full flex items-center justify-between gap-3 rounded-xl border border-[#ece8e0] hover:border-[#2d6a4f] hover:bg-[#f4faf6] px-4 py-3 text-left transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#e6f4ec] text-[#1b5e38] flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-[#1c2b1e]">View completed needs</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#c8d4ca]" />
                </button>
              </Link>
            </div>
          </Card>
          <Card className="border border-[#ece8e0] rounded-2xl p-5 sm:p-7 bg-white flex flex-col">
            <div className="text-xs font-bold tracking-[0.1em] text-[#d4890a] uppercase mb-4 sm:mb-5">
              Snapshot
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-sm text-[#6b7e6d]">Total needs posted</span>
                  <span className="font-['Playfair_Display',serif] text-xl font-bold text-[#1c2b1e]">
                    {totalNeeds}
                  </span>
                </div>
                <Separator className="bg-[#ece8e0]" />
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-sm text-[#6b7e6d]">Completion rate</span>
                  <span className="font-['Playfair_Display',serif] text-xl font-bold text-[#2d6a4f]">
                    {completionRate}%
                  </span>
                </div>
                <Separator className="bg-[#ece8e0]" />
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-sm text-[#6b7e6d]">Volunteers active now</span>
                  <span className="font-['Playfair_Display',serif] text-xl font-bold text-[#3568b8]">
                    {dashboard.volunteersWorking}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-auto pt-5">
              <div className="rounded-xl bg-[#fff4e0] px-4 py-3.5">
                <p className="text-[0.78rem] text-[#7a4800] leading-[1.55]">
                  {dashboard.pendingRequests > 0 ? (
                    <>
                      <strong>{dashboard.pendingRequests}</strong>{" "}
                      {dashboard.pendingRequests === 1 ? "request" : "requests"} waiting on
                      your approval.
                    </>
                  ) : (
                    "No pending requests right now — you're all caught up."
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}