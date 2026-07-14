"use client";

import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { AdminRequestsTableProps } from "@/types/admin-requests.types";
import { useAdminRequestActions } from "@/hooks/use-admin-request-actions";
import { useImageBlurShield } from "@/hooks/use-image-blur-shield";
import RequestCard from "./request-card";
import RejectModal from "./reject-modal";
import SuspendModal from "./suspend-modal";

const TABS = ["ALL", "PENDING", "IN_REVIEW", "COMPLETED"] as const;

export default function AdminRequestsTable({ initialRequests, classes }: AdminRequestsTableProps) {
  const {
    activeTab, setActiveTab, filteredRequests,
    rejectingRequest, setRejectingRequest, rejectReason, setRejectReason,
    banningUser, setBanningUser, banDuration, setBanDuration,
    handleLock, handleUnlock, handleOpenReject, handleRejectSubmit,
    handleOpenBan, handleBanSubmit, handleUnban, handleResetStrikes,
    getStrikeCount, isUserBannedNow,
  } = useAdminRequestActions(initialRequests);

  const { getBlurLevel, cycleBlurLevel, resetBlurLevel } = useImageBlurShield();

  return (
    <div className="w-full mx-auto pb-20 font-['Manrope']">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] uppercase tracking-wider">Pending Animal Requests</h1>
        <p className="text-xs text-[#1a1c19]/50 mt-1">Review community requested animal profiles, correct taxonomy/typos, and approve creations.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-[#e3e3de] pb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-xl transition-all font-['Plus_Jakarta_Sans'] uppercase tracking-wider border",
              activeTab === tab
                ? "bg-[#2d5a27] text-white border-[#2d5a27] shadow-sm"
                : "bg-white text-[#1a1c19]/60 border-[#c2c9bb] hover:bg-[#fafaf5]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Request Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                blurLevel={getBlurLevel(req.id)}
                strikeCount={getStrikeCount(req.user.id, req.user.rejections_reset_at)}
                isBanned={isUserBannedNow(req.user)}
                onCycleBlur={cycleBlurLevel}
                onResetBlur={resetBlurLevel}
                onLock={handleLock}
                onUnlock={handleUnlock}
                onReject={handleOpenReject}
                onBan={handleOpenBan}
                onUnban={handleUnban}
                onResetStrikes={handleResetStrikes}
              />
            ))
          ) : (
            <div className="bg-white border border-[#c2c9bb] border-dashed rounded-2xl p-12 text-center text-[#1a1c19]/40 flex flex-col items-center justify-center min-h-[300px]">
              <span className="material-symbols-outlined text-[48px] text-[#1a1c19]/30 mb-2">inbox</span>
              <p className="text-sm font-semibold">No requests in this queue status.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      {rejectingRequest && (
        <RejectModal
          animalName={rejectingRequest.animal_name}
          rejectReason={rejectReason}
          onReasonChange={setRejectReason}
          onSubmit={handleRejectSubmit}
          onClose={() => setRejectingRequest(null)}
        />
      )}

      {banningUser && (
        <SuspendModal
          userName={banningUser.name}
          banDuration={banDuration}
          onDurationChange={setBanDuration}
          onSubmit={handleBanSubmit}
          onClose={() => setBanningUser(null)}
        />
      )}
    </div>
  );
}