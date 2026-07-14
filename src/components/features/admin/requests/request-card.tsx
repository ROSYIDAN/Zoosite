"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { RequestDetail, RequestUser } from "@/types/admin-requests.types";

interface RequestCardProps {
  req: RequestDetail;
  blurLevel: 3 | 2 | 1;
  strikeCount: number;
  isBanned: boolean;
  onCycleBlur: (id: string) => void;
  onResetBlur: (id: string, e: React.MouseEvent) => void;
  onLock: (id: string) => void;
  onUnlock: (id: string) => void;
  onReject: (req: RequestDetail) => void;
  onBan: (req: RequestDetail) => void;
  onUnban: (userId: string) => void;
  onResetStrikes: (userId: string) => void;
}

/** Single request card with image blur shield, details, and action controls */
export default function RequestCard({
  req,
  blurLevel,
  strikeCount,
  isBanned,
  onCycleBlur,
  onResetBlur,
  onLock,
  onUnlock,
  onReject,
  onBan,
  onUnban,
  onResetStrikes,
}: RequestCardProps) {
  const router = useRouter();
  const isApproved = req.status === "APPROVED";
  const level = isApproved ? 1 : blurLevel;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        "bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6 transition-all",
        req.status === "IN_REVIEW" && "border-amber-400 bg-amber-50/20"
      )}
    >
      {/* Left side: Image + details */}
      <div className="flex flex-col sm:flex-row gap-6 flex-1">
        {/* Image with blur shield */}
        <div
          onClick={() => !isApproved && onCycleBlur(req.id)}
          className={cn(
            "relative w-full sm:w-40 h-40 rounded-xl overflow-hidden shrink-0 border border-[#c2c9bb] transition-all select-none",
            !isApproved && level > 1 ? "cursor-pointer" : "cursor-default"
          )}
        >
          {req.image_url ? (
            <>
              <img
                src={req.image_url}
                alt="Animal uploaded reference"
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  level === 3 && "blur-2xl scale-110",
                  level === 2 && "blur-md scale-102",
                  level === 1 && "blur-none"
                )}
              />

              {!isApproved && level === 3 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 text-white gap-1.5 p-2 text-center transition-all duration-300">
                  <span className="material-symbols-outlined text-[24px] text-amber-400 animate-pulse">shield</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans']">Safety 3x Blur</span>
                  <span className="text-[7.5px] opacity-85 uppercase tracking-wide font-medium">Click to inspect</span>
                </div>
              )}

              {!isApproved && level === 2 && (
                <>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[7.5px] font-bold uppercase tracking-widest border border-white/10">
                    2x Blur
                  </div>
                  <button
                    type="button"
                    onClick={(e) => onResetBlur(req.id, e)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 border border-white/10 transition-colors shadow-md"
                    title="Reset to 3x Blur"
                  >
                    <span className="material-symbols-outlined text-[15px]">lock</span>
                  </button>
                </>
              )}

              {!isApproved && level === 1 && (
                <button
                  type="button"
                  onClick={(e) => onResetBlur(req.id, e)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 border border-white/10 transition-colors shadow-md"
                  title="Reset to 3x Blur"
                >
                  <span className="material-symbols-outlined text-[15px]">lock</span>
                </button>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-[#fafaf5] flex flex-col items-center justify-center text-[#1a1c19]/30">
              <span className="material-symbols-outlined text-[32px]">image_not_supported</span>
              <span className="text-[10px] font-bold uppercase mt-1">No Image</span>
            </div>
          )}
        </div>

        {/* Core details */}
        <div className="space-y-3 flex-1">
          {/* Status badges */}
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-md",
              req.request_type === "FULL_DETAIL" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
            )}>
              {req.request_type === "FULL_DETAIL" ? "FULL DETAIL" : "QUICK REQUEST"}
            </span>
            {req.status === "IN_REVIEW" && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] animate-spin">progress_activity</span>
                LOCK REVIEW
              </span>
            )}
            {req.status === "APPROVED" && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">check_circle</span>
                COMPLETE
              </span>
            )}
            {req.status === "REJECTED" && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">cancel</span>
                REJECTED
              </span>
            )}
          </div>

          {/* Animal name */}
          <div>
            <h2 className="text-md font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans']">{req.animal_name}</h2>
            {req.scientific_name && (
              <p className="text-xs italic text-[#1a1c19]/60">{req.scientific_name}</p>
            )}
          </div>

          {/* Requester info panel */}
          <div className="bg-[#fafaf5] rounded-xl p-3 border border-[#e3e3de] text-xs space-y-1 max-w-[400px]">
            <div className="flex items-center justify-between">
              <span className="text-[#1a1c19]/50">Requester:</span>
              <strong className="text-[#1a1c19]">{req.user.name || req.user.email}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#1a1c19]/50">Strikes (Rejections):</span>
              <span className={cn("font-bold", strikeCount >= 3 ? "text-red-600" : "text-[#1a1c19]")}>
                {strikeCount} / 3
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#e3e3de]">
              <span className="text-[#1a1c19]/50">Privileges status:</span>
              {isBanned ? (
                <span className="text-red-600 font-bold uppercase text-[10px]">Suspended</span>
              ) : (
                <span className="text-green-600 font-bold uppercase text-[10px]">Active</span>
              )}
            </div>

            {strikeCount > 0 && (
              <div className="flex justify-end pt-1.5 border-t border-[#e3e3de] border-dashed">
                <button
                  type="button"
                  onClick={() => onResetStrikes(req.user.id)}
                  className="text-[#2d5a27] hover:text-[#1f3f1b] font-bold text-[9px] uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[11px]">refresh</span>
                  Clear Strikes
                </button>
              </div>
            )}
          </div>

          {/* Rejection reason display */}
          {req.status === "REJECTED" && req.reject_reason && (
            <div className="bg-red-50 text-red-800 rounded-xl p-3 border border-red-200 text-xs mt-2 max-w-[400px]">
              <span className="font-bold block mb-1">Rejection Reason:</span>
              <p className="opacity-90">{req.reject_reason}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Action controls */}
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
    </motion.div>
  );
}