"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

import { RequestDetail } from "./types";
import RequestHistoryFilters from "./request-history-filters";
import RequestHistoryItem from "./request-history-item";
import RequestHistoryEmptyState from "./request-history-empty-state";

interface RequestHistoryProps {
  initialRequests: RequestDetail[];
  initialRejectionCount: number;
}

type FilterType = "ALL" | "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";

export default function RequestHistory({ initialRequests, initialRejectionCount }: RequestHistoryProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestDetail[]>(initialRequests);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

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
      {/* ⚠️ Warning Banner (If initialRejectionCount >= 2) */}
      {initialRejectionCount === 2 && (
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] uppercase tracking-wider">My Animal Requests</h1>
          <p className="text-xs text-[#1a1c19]/50 mt-1">Track contributions and check statuses of your requested animals.</p>
        </div>
        <button
          onClick={() => router.push("/request-animal")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2d5a27] hover:bg-[#1f3f1b] text-white text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl shadow-sm transition-all"
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
                />
              </motion.div>
            ))
          ) : (
            <RequestHistoryEmptyState onNewRequest={() => router.push("/request-animal")} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
