"use client";

import { cn } from "@/lib/utils";
import type { RequestDetail } from "@/types/admin-requests.types";

interface RequestCardDetailsProps {
  req: RequestDetail;
  strikeCount: number;
  isBanned: boolean;
  onResetStrikes: (userId: string) => void;
}

/** Core details section: status badges, animal info, requester panel */
export default function RequestCardDetails({
  req,
  strikeCount,
  isBanned,
  onResetStrikes,
}: RequestCardDetailsProps) {
  return (
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
  );
}