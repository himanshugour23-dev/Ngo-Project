"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Star,
  ClipboardCheck,
  Mail,
  Users,
  UserCircle2,
  ArrowUpRight,
} from "lucide-react";

import NgoTopBar from "@/components/NgoTopBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Volunteer = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  city: string | null;
  skills: string[];
  taskCompleted: number;
  rating: number | null;
  ratingCount: number;
};

type Assignment = {
  assignmentId: string;
  user: Volunteer;
};

export default function ListedVoulenteersClient({
  needId,
  volunteers,
  ngo,
}: {
  needId: string;
  volunteers: Assignment[];
  ngo?: {
    ngoName?: string | null;
    city?: string | null;
    type?: string | null;
    isVerified?: boolean;
  } | null;
}) {
  return (
    <div className="min-h-screen bg-[#faf8f4] font-['Nunito',sans-serif] text-[#1c2b1e]">
      <NgoTopBar
        ngoName={ngo?.ngoName}
        city={ngo?.city}
        type={ngo?.type}
        isVerified={ngo?.isVerified}
        backHref="/ngo/my-needs"
        backLabel="My Needs"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#d4890a] mb-2">
              Volunteer Management
            </p>

            <h1
              className="text-3xl font-bold"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Listed Volunteers
            </h1>

            <p className="text-[#6b7e6d] mt-2 text-sm">
              Volunteers who successfully completed this community need.
            </p>
          </div>

          <Link href="/ngo/my-needs">
            <Button
              variant="outline"
              className="border-[#2d6a4f] text-[#2d6a4f]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
        <Card className="rounded-2xl border border-[#ece8e0] mb-8 bg-white">
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6b7e6d]">
                Completed Volunteers
              </p>

              <h2 className="text-3xl font-bold text-[#2d6a4f] mt-1">
                {volunteers.length}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#e8f5ee] flex items-center justify-center">
              <Users className="h-7 w-7 text-[#2d6a4f]" />
            </div>
          </div>
        </Card>
        {volunteers.length === 0 && (
          <Card className="rounded-2xl border border-dashed border-[#d7d2c8] bg-white py-16">
            <div className="flex flex-col items-center text-center px-4">
              <UserCircle2 className="w-14 h-14 text-[#b8c5ba]" />
              <h2 className="text-xl font-bold mt-5">
                No Listed Volunteers
              </h2>
              <p className="text-[#6b7e6d] mt-2 max-w-md">
                No volunteers have completed this community need yet.
              </p>
            </div>
          </Card>
        )}

        {volunteers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {volunteers.map((volunteer) => {
              const user = volunteer.user;

              const initials = user.name
                .split(" ")
                .map((x) => x[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <Link
                  key={volunteer.assignmentId}
                  href={`/user/${user.id}/public-profile`}
                  className="block group"
                >
                  <Card className="rounded-2xl border border-[#ece8e0] overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-200 h-full cursor-pointer">
                    <div className="p-6">

                      <div className="flex items-center gap-4">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            width={64}
                            height={64}
                            className="rounded-full object-cover w-16 h-16 border"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-[#e8f5ee] border-2 border-[#d5eadb] flex items-center justify-center text-[#2d6a4f] font-bold text-lg shrink-0">
                            {initials}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg truncate group-hover:text-[#2d6a4f] transition-colors">
                            {user.name}
                          </h3>

                          <div className="flex items-center gap-2 text-[#6b7e6d] text-sm mt-1">
                            <Mail className="w-4 h-4 shrink-0" />

                            <span className="truncate">
                              {user.email}
                            </span>
                          </div>

                          {user.city && (
                            <div className="flex items-center gap-2 text-[#6b7e6d] text-sm mt-1">
                              <MapPin className="w-4 h-4 shrink-0" />
                              <span className="truncate">
                                {user.city}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="rounded-xl bg-[#faf8f4] p-3 border border-[#ece8e0]">
                          <div className="flex items-center gap-2 text-[#6b7e6d] text-xs">
                            <Star className="w-4 h-4 text-[#d4890a]" />
                            Rating
                          </div>

                          <p className="font-bold text-lg mt-1">
                            {user.rating != null
                              ? user.rating.toFixed(1)
                              : "N/A"}
                          </p>

                          <p className="text-xs text-[#8a9e8c]">
                            {user.ratingCount} reviews
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#faf8f4] p-3 border border-[#ece8e0]">
                          <div className="flex items-center gap-2 text-[#6b7e6d] text-xs">
                            <ClipboardCheck className="w-4 h-4 text-[#2d6a4f]" />
                            Completed
                          </div>

                          <p className="font-bold text-lg mt-1">
                            {user.taskCompleted}
                          </p>

                          <p className="text-xs text-[#8a9e8c]">
                            Community Tasks
                          </p>
                        </div>
                      </div>
                      {user.skills?.length > 0 && (
                        <div className="mt-6">
                          <p className="text-xs uppercase tracking-wider font-bold text-[#6b7e6d] mb-2">
                            Skills
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill) => (
                              <Badge
                                key={skill}
                                className="bg-[#e8f5ee] text-[#1b5e38] hover:bg-[#e8f5ee] border-0"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-6 pt-4 border-t border-[#ece8e0]">
                        <div className="flex items-center justify-between text-sm font-semibold text-[#2d6a4f]">
                          <span>View Volunteer Profile</span>

                          <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>

                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}