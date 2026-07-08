"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Mail, Tag, Calendar, FileText, Building2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NgoProfile {
  id: string;
  ngoName: string;
  email: string;
  isVerified: boolean;
  city: string;
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const init = parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : parts[0].slice(0, 2);
  return <>{init.toUpperCase()}</>;
}

export default function NgoProfilePage() {
  const [ngo, setNgo] = useState<NgoProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/ngo/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setNgo(data.ngo);
    } catch (err: any) {
      toast.error(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#faf8f4", fontFamily: "'Nunito', sans-serif" }}
      >
        <p className="text-[#6b7e6d]">Loading profile...</p>
      </div>
    );
  }

  if (!ngo) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#faf8f4", fontFamily: "'Nunito', sans-serif" }}
      >
        <p className="text-red-500">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "#faf8f4", fontFamily: "'Nunito', sans-serif" }}
    >
      {/* ── Navbar slot ── */}
      {/* <NgoNavbar /> */}
          
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

        {/* ── Sidebar ── */}
        <aside className="flex flex-col gap-5">

          {/* Identity card */}
          <div
            className="rounded-2xl border p-6 flex flex-col items-center text-center"
            style={{ background: "#fff", borderColor: "#e8e4dc" }}
          >
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-3"
              style={{
                background: "#e8f5ee",
                color: "#2d6a4f",
                border: "3px solid #2d6a4f33",
              }}
            >
              <Initials name={ngo.ngoName} />
            </div>

            <h1
              className="text-xl font-bold leading-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#1c2b1e",
              }}
            >
              {ngo.ngoName}
            </h1>

            <div className="flex items-center gap-1 mt-1 text-sm" style={{ color: "#6b7e6d" }}>
              <MapPin size={13} />
              <span>{ngo.city}</span>
            </div>

            {/* Verification badge */}
            <span
              className="mt-3 text-xs font-semibold px-3 py-1 rounded-full"
              style={
                ngo.isVerified
                  ? { background: "#e8f5ee", color: "#2d6a4f" }
                  : { background: "#fff8ec", color: "#a06000" }
              }
            >
              {ngo.isVerified ? "✓ Verified" : "⏳ Pending verification"}
            </span>

            {/* Motto — placeholder until field exists */}
            <div
              className="mt-4 w-full text-left text-sm italic px-3 py-2 rounded-r-lg"
              style={{
                background: "#faf8f4",
                borderLeft: "3px solid #2d6a4f",
                color: "#6b7e6d",
              }}
            >
              {/* Replace with ngo.motto once field is added */}
              "Connecting hearts, building communities"
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 rounded-xl border-[#2d6a4f] text-[#2d6a4f] hover:bg-[#e8f5ee]"
              asChild
            >
              <Link href="/ngo/profile/edit">
                <Pencil size={14} className="mr-2" />
                Edit Profile
              </Link>
            </Button>
          </div>

          {/* Details card */}
          <div
            className="rounded-2xl border p-5"
            style={{ background: "#fff", borderColor: "#e8e4dc" }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#6b7e6d" }}
            >
              Details
            </p>

            {[
              { icon: Mail, label: ngo.email },
              { icon: Building2, label: "NGO" },
              { icon: MapPin, label: ngo.city },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 py-2 text-sm border-b last:border-0"
                style={{ color: "#3a3a3a", borderColor: "#f0ede8" }}
              >
                <Icon size={15} style={{ color: "#6b7e6d" }} />
                <span className="truncate">{label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="flex flex-col gap-5">

          {/* Stats */}
          <div
            className="rounded-2xl border p-5"
            style={{ background: "#fff", borderColor: "#e8e4dc" }}
          >
            <h2
              className="font-bold mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#1c2b1e",
                fontSize: "1.1rem",
              }}
            >
              Overview
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: "—", label: "Active needs" },
                { val: "—", label: "Volunteers helped" },
                { val: "—", label: "People impacted" },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  className="rounded-xl p-4"
                  style={{ background: "#faf8f4" }}
                >
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#2d6a4f" }}
                  >
                    {val}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#6b7e6d" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Active needs placeholder */}
          <div
            className="rounded-2xl border p-5"
            style={{ background: "#fff", borderColor: "#e8e4dc" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="font-bold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#1c2b1e",
                  fontSize: "1.1rem",
                }}
              >
                Active community needs
              </h2>
              <Button
                size="sm"
                className="rounded-xl text-white text-xs"
                style={{ background: "#2d6a4f" }}
                asChild
              >
                <Link href="/ngo/needs/create">+ Post a need</Link>
              </Button>
            </div>

            {/* Swap this div with your NeedCards component */}
            <div
              className="rounded-xl flex items-center justify-center h-28 text-sm border-2 border-dashed"
              style={{ color: "#b0afa8", borderColor: "#e0ddd6", background: "#faf8f4" }}
            >
              Your posted needs will appear here
            </div>
          </div>

          {/* Volunteer requests placeholder */}
          <div
            className="rounded-2xl border p-5"
            style={{ background: "#fff", borderColor: "#e8e4dc" }}
          >
            <h2
              className="font-bold mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#1c2b1e",
                fontSize: "1.1rem",
              }}
            >
              Volunteer requests
            </h2>
            <div
              className="rounded-xl flex items-center justify-center h-28 text-sm border-2 border-dashed"
              style={{ color: "#b0afa8", borderColor: "#e0ddd6", background: "#faf8f4" }}
            >
              Pending volunteer requests will appear here
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}