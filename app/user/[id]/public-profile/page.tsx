"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {ArrowLeft,MapPin,Mail,Star,ClipboardCheck,Briefcase,HeartHandshake,
  UserCircle2,CheckCircle2,XCircle} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface PublicUserProfileData {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  skills: string[];
  preferredCategories: string[];
  isActive: boolean;
  image: string | null;
  city: string | null;
  taskCompleted: number;
  rating: number | null;
  ratingCount: number;
}

export default function PublicVolunteerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [profile, setProfile] =
    useState<PublicUserProfileData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  async function fetchProfile() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/user/${id}/public-profile`
      );

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Please login as an NGO to view this profile");
          router.push("/ngo-login");
          return;
        }

        throw new Error(
          data.message || "Failed to load profile"
        );
      }

      setProfile(data.user);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load profile";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#d5eadb] border-t-[#2d6a4f] rounded-full animate-spin mx-auto" />

          <p className="text-sm text-[#6b7e6d] mt-4">
            Loading volunteer profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center px-4">
        <Card className="max-w-md w-full rounded-2xl border-[#ece8e0] p-10 text-center">
          <UserCircle2 className="w-14 h-14 text-[#b8c5ba] mx-auto" />

          <h2 className="text-xl font-bold mt-4">
            Volunteer Not Found
          </h2>

          <p className="text-sm text-[#6b7e6d] mt-2">
            We couldn't find this volunteer profile.
          </p>

          <Button
            onClick={() => router.back()}
            className="mt-6 bg-[#2d6a4f] hover:bg-[#245a43]"
          >
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#faf8f4] font-['Nunito',sans-serif] text-[#1c2b1e]">

      <div className="border-b border-[#ece8e0] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">

          <Link
            href="/ngo/my-needs"
            className="flex items-center gap-2 text-sm font-semibold text-[#2d6a4f] hover:text-[#1b4332]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Needs
          </Link>

          <div className="text-sm font-bold text-[#2d6a4f]">
            ngoSupport
          </div>

        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#d4890a] mb-2">
            Volunteer Profile
          </p>

          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Volunteer Details
          </h1>

          <p className="text-sm text-[#6b7e6d] mt-2">
            View the volunteer's profile, experience and community contribution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">

          <Card className="rounded-2xl border border-[#ece8e0] bg-white overflow-hidden h-fit">

            <div className="h-24 bg-gradient-to-r from-[#2d6a4f] to-[#1b4332]" />

            <div className="px-6 pb-6">

              <div className="-mt-12 mb-4">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#e8f5ee] border-4 border-white shadow-md flex items-center justify-center text-[#2d6a4f] font-bold text-2xl">
                    {initials}
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold">
                {profile.name}
              </h2>

              <div className="mt-2">
                {profile.isActive ? (
                  <Badge className="bg-[#e8f5ee] text-[#1b5e38] hover:bg-[#e8f5ee] border-0">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active Volunteer
                  </Badge>
                ) : (
                  <Badge className="bg-[#f4f1ea] text-[#6b7e6d] hover:bg-[#f4f1ea] border-0">
                    <XCircle className="w-3 h-3 mr-1" />
                    Currently Inactive
                  </Badge>
                )}
              </div>

              <div className="mt-6 space-y-3">

                <div className="flex items-center gap-3 text-sm text-[#6b7e6d]">
                  <Mail className="w-4 h-4 shrink-0 text-[#2d6a4f]" />

                  <span className="truncate">
                    {profile.email}
                  </span>
                </div>

                {profile.city && (
                  <div className="flex items-center gap-3 text-sm text-[#6b7e6d]">
                    <MapPin className="w-4 h-4 shrink-0 text-[#2d6a4f]" />

                    <span>
                      {profile.city}
                    </span>
                  </div>
                )}

              </div>

            </div>
          </Card>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="rounded-2xl border border-[#ece8e0] bg-white p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-[#6b7e6d]">
                      Volunteer Rating
                    </p>

                    <div className="flex items-center gap-2 mt-2">

                      <Star className="w-5 h-5 fill-[#d4890a] text-[#d4890a]" />

                      <span className="text-2xl font-bold">
                        {profile.rating != null
                          ? profile.rating.toFixed(1)
                          : "N/A"}
                      </span>

                      <span className="text-xs text-[#8a9e8c]">
                        / 5
                      </span>

                    </div>

                    <p className="text-xs text-[#8a9e8c] mt-1">
                      Based on {profile.ratingCount} reviews
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-[#fff4e0] flex items-center justify-center">
                    <Star className="w-6 h-6 text-[#d4890a]" />
                  </div>

                </div>

              </Card>

              <Card className="rounded-2xl border border-[#ece8e0] bg-white p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-[#6b7e6d]">
                      Tasks Completed
                    </p>

                    <p className="text-2xl font-bold text-[#2d6a4f] mt-2">
                      {profile.taskCompleted}
                    </p>

                    <p className="text-xs text-[#8a9e8c] mt-1">
                      Community contributions
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                    <ClipboardCheck className="w-6 h-6 text-[#2d6a4f]" />
                  </div>

                </div>

              </Card>

            </div>

            <Card className="rounded-2xl border border-[#ece8e0] bg-white p-6">

              <h3 className="font-bold text-lg">
                About
              </h3>

              <p className="text-sm text-[#6b7e6d] leading-6 mt-3">
                {profile.bio ||
                  "This volunteer hasn't added a bio yet."}
              </p>

            </Card>

            <Card className="rounded-2xl border border-[#ece8e0] bg-white p-6">

              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-[#2d6a4f]" />

                <h3 className="font-bold text-lg">
                  Skills
                </h3>
              </div>

              {profile.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-[#e8f5ee] text-[#1b5e38] hover:bg-[#e8f5ee] border-0 px-3 py-1.5"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#8a9e8c]">
                  No skills added yet.
                </p>
              )}

            </Card>

            <Card className="rounded-2xl border border-[#ece8e0] bg-white p-6">

              <div className="flex items-center gap-2 mb-4">
                <HeartHandshake className="w-5 h-5 text-[#d4890a]" />

                <h3 className="font-bold text-lg">
                  Preferred Causes
                </h3>
              </div>

              {profile.preferredCategories?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.preferredCategories.map(
                    (category) => (
                      <Badge
                        key={category}
                        className="bg-[#fff4e0] text-[#7a4800] hover:bg-[#fff4e0] border-0 px-3 py-1.5"
                      >
                        {category}
                      </Badge>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-[#8a9e8c]">
                  No preferred causes specified.
                </p>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}