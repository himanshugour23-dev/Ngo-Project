// app/ngo/_components/NgoTopBar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, LogOut, Loader2, CheckCircle2, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type NgoTopBarProps = {
  ngoName?: string | null;
  city?: string | null;
  type?: string | null;
  isVerified?: boolean;
  backHref?: string;
  backLabel?: string;
};

export default function NgoTopBar({
  ngoName,
  city,
  type,
  isVerified,
  backHref,
  backLabel = "Back",
}: NgoTopBarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const initials =
    ngoName
      ?.split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() ?? "NG";

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

  return (
    <div className="border-b border-[#ece8e0] bg-white px-4 sm:px-10 py-3.5 sm:py-5">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {backHref && (
            <Link
              href={backHref}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#6b7e6d] hover:text-[#2d6a4f] transition-colors mr-1 shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
              {backLabel}
            </Link>
          )}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-[#1b5e38] font-bold text-xs sm:text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[0.85rem] sm:text-[0.95rem] font-bold text-[#1c2b1e] truncate">
                {ngoName ?? "Your NGO"}
              </h1>
              {isVerified ? (
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
              {city ?? "Location not set"} · {type ?? "NGO"}
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
  );
}