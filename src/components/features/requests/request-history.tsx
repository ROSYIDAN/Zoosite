"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

import { RequestDetail } from "./types";
import RequestHistoryFilters from "./request-history-filters";
import RequestHistoryItem from "./request-history-item";
import RequestHistoryEmptyState from "./request-history-empty-state";
import { GuidelinesModal } from "./guidelines-modal";

interface RequestHistoryProps {
  initialRequests: RequestDetail[];
  initialRejectionCount: number;
  isBanned: boolean;
  bannedUntil: string | null;
}

type FilterType = "ALL" | "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";

export default function RequestHistory({
  initialRequests,
  initialRejectionCount,
  isBanned,
  bannedUntil,
}: RequestHistoryProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestDetail[]>(initialRequests);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState<boolean>(false);

  useEffect(() => {
    const alreadyRead = localStorage.getItem("zoosite_guidelines_read") === "true";
    if (!alreadyRead) {
      setIsGuidelinesOpen(true);
    }
  }, []);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!isBanned || !bannedUntil) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(bannedUntil) - +new Date();
      if (difference <= 0) {
        setTimeLeft("");
        router.refresh();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const parts: string[] = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setTimeLeft(parts.join(" "));
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [isBanned, bannedUntil, router]);

  const filteredRequests = requests.filter((req) => {
    if (filter === "ALL") return true;
    return req.status === filter;
  });

  const handleWithdraw = async (id: string) => {
    if (!confirm("Are you sure you want to withdraw this request? This will permanently delete it.")) {
      return;
    }

    setIsDeletingId(id);
    const toastId = toast.loading("Withdrawing request...");
    try {
      const res = await fetch(`/api/animals/request/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Request withdrawn successfully!", { id: toastId });
        setRequests((prev) => prev.filter((r) => r.id !== id));
        router.refresh();
      } else {
        const json = await res.json().catch(() => ({}));
        toast.error(json.message || "Failed to withdraw request.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.", { id: toastId });
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleResubmit = (req: RequestDetail) => {
    localStorage.setItem("resubmit_animal_request", JSON.stringify(req));
    router.push("/request-animal?resubmit=true");
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto pb-20 font-['Manrope']">
      {/* Guidelines Modal Component */}
      <GuidelinesModal isOpen={isGuidelinesOpen} onOpenChange={setIsGuidelinesOpen} />
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
