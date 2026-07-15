"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { RequestDetail } from "@/types/admin-requests.types";

interface RequestCardActionsProps {
  req: RequestDetail;
  strikeCount: number;
  isBanned: boolean;
  onLock: (id: string) => void;
  onUnlock: (id: string) => void;
  onReject: (req: RequestDetail) => void;
  onBan: (req: RequestDetail) => void;
  onUnban: (userId: string) => void;
}

/** Action controls section: review, reject, suspend buttons */
export default function RequestCardActions({
  req,
  strikeCount,
  isBanned,
  onLock,
  onUnlock,
  onReject,
  onBan,
  onUnban,
}: RequestCardActionsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-row md:flex-col justify-end gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#e3e3de] md:border-l md:pl-6 border-dashed border-[#c2c9bb]">
      {req.status === "PENDING" && (
        <button
          onClick={() => onLock(req.id)}
          className="px-6 py-2.5 bg-[#2d5a27] hover:bg-[#1f3f1b] text-white text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl shadow-sm transition-all"
        >
          Start Review
        </button>
      )}

      {req.status === "IN_REVIEW" && (
        <>
          <button
            onClick={() => router.push(`/admin/requests/${req.id}/review`)}
            className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl shadow-sm transition-all"
          >
            {req.request_type === "FULL_DETAIL" ? "Review & Approve" : "Complete & Approve"}
          </button>

          <button
            onClick={() => onUnlock(req.id)}
            className="px-6 py-2.5 border border-amber-300 text-amber-700 hover:bg-amber-50 text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl transition-colors font-semibold"
          >
            Cancel Review
          </button>

          <button
            onClick={() => onReject(req)}
            className="px-6 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl transition-colors"
          >
            Reject
          </button>
        </>
      )}

      {req.status === "APPROVED" && req.approved_animal?.canonical_slug && (
        <a
          href={`/animals/${req.approved_animal.canonical_slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2.5 bg-[#2d5a27] hover:bg-[#1f3f1b] text-white text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">visibility</span>
          View Profile
        </a>
      )}

      {/* Suspend/Restore toggle */}
      {req.status !== "APPROVED" && (
        <>
          {isBanned ? (
            <button
              onClick={() => onUnban(req.user.id)}
              className="px-4 py-2 border border-green-200 text-green-700 hover:bg-green-50 text-[10px] font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl transition-colors"
            >
              Restore Privileges
            </button>
          ) : (
            <button
              onClick={() => onBan(req)}
              className={cn(
                "px-4 py-2 border text-[10px] font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl transition-colors",
                strikeCount >= 3
                  ? "border-red-300 text-red-600 bg-red-50/50 hover:bg-red-50"
                  : "border-[#c2c9bb] text-[#1a1c19]/60 hover:bg-[#fafaf5]"
              )}
            >
              Suspend User
            </button>
          )}
        </>
      )}
    </div>
  );
}