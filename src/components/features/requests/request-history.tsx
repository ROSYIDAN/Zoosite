"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { RequestDetail } from "./types";
import RequestHistoryFilters from "./request-history-filters";
import RequestHistoryItem from "./request-history-item";
import RequestHistoryEmptyState from "./request-history-empty-state";
import { GuidelinesModal } from "./guidelines-modal";
import { useRequestHistory } from "@/hooks/use-request-history";
import { RequestHistoryBanners } from "./request-history-banners";

interface RequestHistoryProps {
  initialRequests: RequestDetail[];
  initialRejectionCount: number;
  isBanned: boolean;
  bannedUntil: string | null;
}

export default function RequestHistory({
  initialRequests,
  initialRejectionCount,
  isBanned,
  bannedUntil,
}: RequestHistoryProps) {
  const router = useRouter();
  const {
    filter,
    setFilter,
    isGuidelinesOpen,
    setIsGuidelinesOpen,
    isDeletingId,
    timeLeft,
    filteredRequests,
    handleWithdraw,
    handleResubmit,
  } = useRequestHistory({
    initialRequests,
    isBanned,
    bannedUntil,
  });

  return (
    <div className="w-full max-w-screen-2xl mx-auto pb-20 font-['Manrope']">
      {/* Guidelines Modal Component */}
      <GuidelinesModal isOpen={isGuidelinesOpen} onOpenChange={setIsGuidelinesOpen} />

      {/* Warning, Temp Ban, and Permanent Ban Banners */}
      <RequestHistoryBanners
        isBanned={isBanned}
        initialRejectionCount={initialRejectionCount}
        bannedUntil={bannedUntil}
        timeLeft={timeLeft}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
              My Animal Requests
            </h1>
            <button
              type="button"
              onClick={() => setIsGuidelinesOpen(true)}
              className="w-6 h-6 rounded-full bg-[#2d5a27]/10 hover:bg-[#2d5a27]/20 text-[#2d5a27] transition-all flex items-center justify-center cursor-pointer shadow-sm"
              title="View Contribution Guidelines"
            >
              <span className="material-symbols-outlined text-[14px] font-bold">gavel</span>
            </button>
          </div>
          <p className="text-xs text-[#1a1c19]/50 mt-1">Track contributions and check statuses of your requested animals.</p>
        </div>
        <button
          disabled={isBanned}
          onClick={() => !isBanned && router.push("/request-animal")}
          className={cn(
            "inline-flex items-center gap-2 px-5 py-2.5 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl shadow-sm transition-all",
            isBanned
              ? "bg-[#2d5a27]/40 text-white/60 cursor-not-allowed shadow-none"
              : "bg-[#2d5a27] hover:bg-[#1f3f1b]"
          )}
          title={isBanned ? "Your contribution privileges are currently suspended." : undefined}
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Request
        </button>
      </div>

      {/* Filters Sub-component */}
      <RequestHistoryFilters currentFilter={filter} onChangeFilter={setFilter} />

      {/* Request Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={req.id}
              >
                <RequestHistoryItem
                  req={req}
                  onWithdraw={handleWithdraw}
                  onResubmit={handleResubmit}
                  isDeleting={isDeletingId === req.id}
                  isBanned={isBanned}
                />
              </motion.div>
            ))
          ) : (
            <RequestHistoryEmptyState onNewRequest={() => router.push("/request-animal")} isBanned={isBanned} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}