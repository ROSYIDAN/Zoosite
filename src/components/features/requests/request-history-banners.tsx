"use client";

import { motion } from "framer-motion";

interface RequestHistoryBannersProps {
  isBanned: boolean;
  initialRejectionCount: number;
  bannedUntil: string | null;
  timeLeft: string;
}

export function RequestHistoryBanners({
  isBanned,
  initialRejectionCount,
  bannedUntil,
  timeLeft,
}: RequestHistoryBannersProps) {
  return (
    <>
      {/* ⚠️ Warning Banner (Only if not banned and initialRejectionCount === 2) */}
      {!isBanned && initialRejectionCount === 2 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 mb-8 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900 font-['Plus_Jakarta_Sans']">Warning: Strikes Active</h4>
            <p className="text-xs text-amber-800/80 leading-relaxed mt-0.5">
              You currently have **2 rejected requests** in your history. A third rejection may result in your request privileges being suspended. Please use the <strong>Fix & Resubmit</strong> button on rejected requests to correct details before submitting again!
            </p>
          </div>
        </div>
      )}

      {/* ⏳ Temporary Ban Banner with live-ticking Countdown */}
      {isBanned && bannedUntil && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 mb-8 shadow-sm font-['Manrope'] backdrop-blur-sm"
        >
          <div className="w-12 h-12 rounded-full bg-amber-100/80 flex items-center justify-center shrink-0 text-amber-600 shadow-inner">
            <span className="material-symbols-outlined text-[24px]">hourglass_empty</span>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-amber-900 font-['Plus_Jakarta_Sans'] flex flex-wrap items-center gap-2">
              <span>Contribution Privileges Temporarily Suspended</span>
              {timeLeft && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-mono font-semibold">
                  <span className="material-symbols-outlined text-[14px] animate-pulse">timer</span>
                  {timeLeft}
                </span>
              )}
            </h4>
            <p className="text-xs text-amber-800/90 leading-relaxed mt-2">
              To maintain the integrity and educational standards of our community-curated wildlife database, your request privileges have been temporarily paused. We warmly value your enthusiasm and help, and look forward to welcoming your suggestions again once the cooling-off period concludes.
            </p>
            <p className="text-xs text-amber-800/70 leading-relaxed mt-1.5">
              In the meantime, we kindly invite you to review our contribution guidelines so that your next submission meets all factual and formatting standards. Thank you for helping us build a respectful, collaborative community!
            </p>
          </div>
        </motion.div>
      )}

      {/* 🛡️ Permanent Ban Banner with respectful explanation */}
      {isBanned && !bannedUntil && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 mb-8 shadow-sm font-['Manrope'] backdrop-blur-sm"
        >
          <div className="w-12 h-12 rounded-full bg-rose-100/80 flex items-center justify-center shrink-0 text-rose-600 shadow-inner">
            <span className="material-symbols-outlined text-[24px]">diversity_3</span>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-rose-950 font-['Plus_Jakarta_Sans']">
              A Respectful Note on Community Contributions
            </h4>
            <p className="text-xs text-rose-900/90 leading-relaxed mt-2">
              Our wildlife database is a collaborative effort built by a small, passionate community of volunteers dedicated to sharing accurate, educational, and family-friendly natural science. Because several of your previous requests did not align with these core standards, your privilege to submit new animals has been permanently suspended.
            </p>
            <p className="text-xs text-rose-900/85 leading-relaxed mt-1.5 font-medium">
              We deeply care about keeping our platform a safe, constructive, and accurate space for students, teachers, and nature enthusiasts alike. While you can no longer submit new request drafts, your past contributions remain visible here, and you are welcome to browse the curated database. We kindly ask for your understanding and cooperation in keeping our small community's shared space respectful.
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}