"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, XCircle, MapPin, Star, Briefcase, ClipboardList, Tag } from "lucide-react";
import { toast } from "sonner";
import NgoTopBar from "@/components/NgoTopBar";
interface Volunteer {
  id: string;
  name: string;
  email: string;
  city: string | null;
  skills: string[];
  rating: number | null;
  taskCompleted: number;
  preferredCategories: string[];
}

interface Request {
  assignmentId: string;
  needId: string;
  createdAt: string;
  approvalStatus: string;
  user: Volunteer;
}

function InitialAvatar({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const initials = parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : name.slice(0, 2);
  return (
    <div className="w-12 h-12 rounded-full bg-[#e8f5ee] border-2 border-[#2d6a4f22] flex items-center justify-center text-[#2d6a4f] font-bold text-sm flex-shrink-0">
      {initials.toUpperCase()}
    </div>
  );
}

export default function VolunteerRequestsPage() {
  const { id: needId } = useParams<{ id: string }>();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, "approve" | "reject" | null>>({});

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      setLoading(true);
      const res = await fetch(`/api/communityNeeds/${needId}/requests`) ; 
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setRequests(data.requests);
    } catch (err: any) {
      toast.error(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(assignmentId: string, action: "approve" | "reject") {
    setActionLoading((prev) => ({ ...prev, [assignmentId]: action }));
    try {
    const res = await fetch(`/api/communityNeeds/${needId}/requests/${assignmentId}/${action === "approve" ? "approved" : "rejected"}`,
  { method: "POST",}
);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to ${action}`);
      toast.success(data.message || `Volunteer ${action}d successfully`);
      setRequests((prev) => prev.filter((r) => r.assignmentId !== assignmentId));
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setActionLoading((prev) => ({ ...prev, [assignmentId]: null }));
    }
  }

  if (loading) { return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#faf8f4", fontFamily: "'Nunito', sans-serif" }}>
        <p className="text-[#6b7e6d] text-sm">Loading volunteer requests...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#faf8f4", fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#d4890a] mb-1">Volunteer management</p>
          <h1 className="text-2xl font-bold text-[#1c2b1e]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Pending Requests
          </h1>
          <p className="text-sm text-[#6b7e6d] mt-1">
            {requests.length === 0 ? "No pending requests for this need." : `${requests.length} volunteer${requests.length > 1 ? "s" : ""} waiting for your review`}
          </p>
        </div>

        {requests.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#c8d5ca] bg-white flex flex-col items-center justify-center py-20 text-center">
            <ClipboardList className="w-10 h-10 text-[#c8d5ca] mb-3" />
            <p className="text-[#6b7e6d] font-semibold text-sm">No pending requests</p>
            <p className="text-[#a0b0a2] text-xs mt-1">New volunteer applications will appear here</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {requests.map((req) => {
            const isApproving = actionLoading[req.assignmentId] === "approve";
            const isRejecting = actionLoading[req.assignmentId] === "reject";
            const isActing = isApproving || isRejecting;

            return (
              <div
                key={req.assignmentId}
                className="bg-white rounded-2xl border border-[#e8e4dc] p-5 sm:p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <InitialAvatar name={req.user.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-[#1c2b1e] text-base leading-tight">{req.user.name}</p>
                        <p className="text-xs text-[#6b7e6d] mt-0.5">{req.user.email}</p>
                      </div>
                      <span className="text-xs text-[#a0b0a2] flex-shrink-0">
                        {new Date(req.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {req.user.city && (
                        <span className="inline-flex items-center gap-1 text-xs bg-[#f5f2ed] text-[#4e6352] px-2.5 py-1 rounded-full font-medium">
                          <MapPin className="w-3 h-3" />
                          {req.user.city}
                        </span>
                      )}
                      {req.user.rating != null && (
                        <span className="inline-flex items-center gap-1 text-xs bg-[#fff8ec] text-[#7a4800] px-2.5 py-1 rounded-full font-medium">
                          <Star className="w-3 h-3 fill-[#d4890a] stroke-[#d4890a]" />
                          {req.user.rating.toFixed(1)} rating
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs bg-[#e8f5ee] text-[#1b5e38] px-2.5 py-1 rounded-full font-medium">
                        <ClipboardList className="w-3 h-3" />
                        {req.user.taskCompleted} tasks done
                      </span>
                    </div>
                  </div>
                </div>

                {req.user.skills?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold text-[#6b7e6d] uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {req.user.skills.map((skill) => (
                        <span key={skill} className="text-xs bg-[#faf8f4] border border-[#e8e4dc] text-[#4e6352] px-2.5 py-1 rounded-lg font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {req.user.preferredCategories?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-[#6b7e6d] uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Interests
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {req.user.preferredCategories.map((cat) => (
                        <span key={cat} className="text-xs bg-[#e8f5ee] border border-[#c8e6d8] text-[#1b5e38] px-2.5 py-1 rounded-lg font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-[#f0ede8] mt-4 pt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
                  <button
                    onClick={() => handleAction(req.assignmentId, "reject")}
                    disabled={isActing}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#f0c8c8] bg-[#fdf4f4] text-[#a32d2d] text-sm font-bold transition-all hover:bg-[#fde8e8] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-4 h-4" />
                    {isRejecting ? "Rejecting..." : "Reject"}
                  </button>
                  <button
                    onClick={() => handleAction(req.assignmentId, "approve")}
                    disabled={isActing}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-none bg-[#2d6a4f] text-white text-sm font-bold transition-all hover:bg-[#245a43] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isApproving ? "Approving..." : "Approve"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}