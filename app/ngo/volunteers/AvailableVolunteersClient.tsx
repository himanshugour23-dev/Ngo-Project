"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {ArrowLeft,MapPin,Star,ClipboardCheck,Mail,Users,UserCircle2,Send,Eye,
} from "lucide-react";

import NgoTopBar from "@/components/NgoTopBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";

type Volunteer = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  city: string | null;
  bio: string | null;
  skills: string[];
  preferredCategories: string[];
  taskCompleted: number;
  rating: number | null;
  ratingCount: number;
};

type Need = {
  id: string;
  ProblemDescription: string;
  ProblemCategory: string;
};

export default function AvailableVolunteersClient({
  volunteers,
  ngo,
  needs,
}: {
  volunteers: Volunteer[];
  needs: Need[];
  ngo?: {
    ngoName?: string | null;
    city?: string | null;
    type?: string | null;
    isVerified?: boolean;
  } | null;
}) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] =useState<Volunteer | null>(null);
  const [selectedNeedId, setSelectedNeedId] =useState("");
  const [assigning, setAssigning] =useState(false);
  async function handleAssign() {
    if (!selectedUser) return;
    if (!selectedNeedId) {
      toast.error("Please select a community need");
      return;
    }

    try {
      setAssigning(true);

      const res = await fetch(
        "/api/ngo/assigned",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId: selectedUser.id,
            needId: selectedNeedId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data.message ||
            "Failed to assign task"
        );
        return;
      }
      toast.success(data.message ||"Task assigned successfully");
      setOpen(false);
      setSelectedUser(null);
      setSelectedNeedId("");
      window.location.reload();

    } catch (error) {
      console.error(error);
      toast.error(
        "Something went wrong"
      );
    } finally {
      setAssigning(false);
    }
  }

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

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#d4890a] mb-2">
              Volunteer Management
            </p>

            <h1
              className="text-3xl font-bold"
              style={{
                fontFamily:
                  "'Playfair Display', serif",
              }}
            >
              Available Volunteers
            </h1>

            <p className="text-[#6b7e6d] mt-2 text-sm">
              Browse available volunteers and
              assign them to your community needs.
            </p>
          </div>

          <Link href="/ngo/dashboard">
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
                Available Volunteers
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
            <div className="flex flex-col items-center text-center">
              <UserCircle2 className="w-14 h-14 text-[#b8c5ba]" />
              <h2 className="text-xl font-bold mt-5">
                No Available Volunteers
              </h2>
              <p className="text-[#6b7e6d] mt-2 max-w-md px-4">
                There are currently no volunteers
                available for direct assignment.
              </p>
            </div>
          </Card>
        )}

        {volunteers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {volunteers.map((user) => {
              const initials = user.name
                .split(" ")
                .map((x) => x[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <Card
                  key={user.id}
                  className="rounded-2xl border border-[#ece8e0] overflow-hidden bg-white hover:shadow-xl transition-all"
                >
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
                        <div className="w-16 h-16 rounded-full bg-[#e8f5ee] border-2 border-[#d5eadb] flex items-center justify-center text-[#2d6a4f] font-bold text-lg">
                          {initials}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">

                        <h3 className="font-bold text-lg truncate">
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
                            <MapPin className="w-4 h-4" />
                            {user.city}
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
                          {user.rating
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
                          {user.skills
                            .slice(0, 4)
                            .map((skill) => (
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

                    <div className="flex flex-col sm:flex-row gap-2 mt-6">

                      <Link
                        href={`/user/${user.id}/public-profile`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-[#2d6a4f] text-[#2d6a4f]"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </Link>

                      <Button
                        onClick={() => {
                          setSelectedUser(user);
                          setSelectedNeedId("");
                          setOpen(true);
                        }}
                        className="flex-1 bg-[#2d6a4f] hover:bg-[#245a43]"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Assign Task
                      </Button>

                    </div>

                  </div>
                </Card>
              );
            })}

          </div>
        )}

      </main>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              Assign Community Need
            </DialogTitle>
            <DialogDescription>
              Select a community need to assign
              to {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">

            {needs.length === 0 ? (

              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-[#6b7e6d]">
                You don't have any active
                community needs available.
              </div>

            ) : (

              <div className="space-y-2">

                {needs.map((need) => (

                  <button
                    key={need.id}
                    type="button"
                    onClick={() =>
                      setSelectedNeedId(
                        need.id
                      )
                    }
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      selectedNeedId === need.id
                        ? "border-[#2d6a4f] bg-[#e8f5ee]"
                        : "border-[#ece8e0] hover:bg-[#faf8f4]"
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#1c2b1e] line-clamp-2">
                      {need.ProblemDescription}
                    </p>
                    <p className="text-xs text-[#6b7e6d] mt-1 capitalize">
                      {need.ProblemCategory}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              onClick={handleAssign}
              disabled={
                assigning ||
                !selectedNeedId
              }
              className="bg-[#2d6a4f] hover:bg-[#245a43]"
            >
              {assigning
                ? "Assigning..."
                : "Assign Task"}
            </Button>

          </DialogFooter>

        </DialogContent>
      </Dialog>

    </div>
  );
}