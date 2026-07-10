"use client";
import Image from "next/image";
import Link from "next/link";
import {ArrowLeft,MapPin,Star,ClipboardCheck,Mail,Users,UserCircle2,
} from "lucide-react";
import { useState } from "react";
import {Dialog, DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter,} from "@/components/ui/dialog";
import NgoTopBar from "@/components/NgoTopBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {toast} from "sonner"
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

export default function ActiveVolunteersClient({needId,volunteers,ngo,}: {
  needId: string; volunteers: Assignment[];
  ngo?: {
    ngoName?: string | null;
    city?: string | null;
    type?: string | null;
    isVerified?: boolean;} | null;
})
{
const [open, setOpen] = useState(false);
const [rating, setRating] = useState(5);
const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
const handleComplete = async () => {
  if (rating === 0) {
    toast.error("Please rate the volunteer before completing the task.");
    return;
  }
  const res = await fetch(
    `/api/communityNeeds/${needId}/requests/${selectedAssignment}/compleated`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating,
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    toast.error(data.message);
    return;
  }
  toast.success(data.message);
  setOpen(false);
  window.location.reload();
  setOpen(false);
};
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
              Active Volunteers
            </h1>

            <p className="text-[#6b7e6d] mt-2 text-sm">
              Volunteers currently approved and working on this community need.
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
                Active Volunteers
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
                No Active Volunteers
              </h2>

              <p className="text-[#6b7e6d] mt-2 max-w-md">
                Once you approve volunteer requests they will appear here.
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
                <Card
                  key={volunteer.assignmentId}
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

                    {user.skills.length > 0 && (
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

                    <div className="flex flex-col gap-2 mt-6">

                      <Button
                      onClick={() => {
                        setSelectedAssignment(volunteer.assignmentId);
                        setOpen(true);
                      }}
                      className="w-full bg-[#2d6a4f] hover:bg-[#245a43]"
                    >
                      Mark As Completed
                    </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

      </main>
      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-md rounded-2xl">

    <DialogHeader>
      <DialogTitle>Complete Volunteer Task</DialogTitle>

      <DialogDescription>
        Rate the volunteer's contribution before marking the task as completed.
      </DialogDescription>
    </DialogHeader>

    <div className="py-4">

      <p className="font-semibold mb-3">
        Rating
      </p>

      <div className="flex gap-2 justify-center">

        {[1,2,3,4,5].map((num)=>(
          <button
            key={num}
            onClick={()=>setRating(num)}
          >
            <Star
              className={`h-8 w-8 ${
                rating>=num
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
              }`}
            />
          </button>
        ))}

      </div>

      <p className="text-center text-sm text-[#6b7e6d] mt-3">
        {rating}/5
      </p>

    </div>

    <DialogFooter>
      <Button variant="outline"
        onClick={()=>setOpen(false)}>
        Cancel
      </Button>
      <Button
        onClick={handleComplete}
        className="bg-[#2d6a4f]"
      >
        Submit
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
}  