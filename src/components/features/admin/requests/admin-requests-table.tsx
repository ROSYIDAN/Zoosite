"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface RequestUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  is_request_banned: boolean;
  request_banned_until: string | null;
  rejections_reset_at: string | null;
}

interface RequestDetail {
  id: string;
  request_type: "QUICK" | "FULL_DETAIL";
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";
  animal_name: string;
  image_url: string | null;
  image_public_id: string | null;
  scientific_name: string | null;
  synonyms: string | null;
  family: string | null;
  genus: string | null;
  ordo: string | null;
  class_id: string | null;
  description: string | null;
  description_source: string | null;
  diet: string | null;
  lifespan_years: string | null;
  weight_kg: string | null;
  height_cm: string | null;
  avg_speed_kmh: string | null;
  top_speed_kmh: string | null;
  social_structure: string | null;
  conservation_status: string | null;
  predators: string | null;
  tags: string[];
  countries: string[];
  habitats: string[];
  review_started: string | null;
  reject_reason: string | null;
  approved_animal_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  user: RequestUser;
  approved_animal?: {
    id: string;
    canonical_slug: string;
  } | null;
}

interface AdminRequestsTableProps {
  initialRequests: RequestDetail[];
  classes: { id: string; name: string }[];
}

export default function AdminRequestsTable({ initialRequests, classes }: AdminRequestsTableProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestDetail[]>(initialRequests);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "IN_REVIEW" | "COMPLETED">("ALL");
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);

  // Modals / Overlays states
  const [rejectingRequest, setRejectingRequest] = useState<RequestDetail | null>(null);
  const [banningUser, setBanningUser] = useState<{ userId: string; name: string } | null>(null);
  const [banDuration, setBanDuration] = useState<"7" | "30" | "PERMANENT">("7");

  // Rejection input
  const [rejectReason, setRejectReason] = useState("");

  // Image safety blur level per request ID (3 = Max, 2 = Medium, 1 = Clear)
  const [blurLevels, setBlurLevels] = useState<Record<string, 3 | 2 | 1>>({});

  const filteredRequests = requests.filter((req) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "COMPLETED") return req.status === "APPROVED" || req.status === "REJECTED";
    return req.status === activeTab;
  });

  const getBlurLevel = (id: string): 3 | 2 | 1 => {
    return blurLevels[id] ?? 3;
  };

  const cycleBlurLevel = (id: string) => {
    setBlurLevels((prev) => {
      const current = prev[id] ?? 3;
      if (current === 3) return { ...prev, [id]: 2 };
      if (current === 2) return { ...prev, [id]: 1 };
      return prev;
    });
  };

  const resetBlurLevel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBlurLevels((prev) => ({ ...prev, [id]: 3 }));
  };

  const handleAction = async (id: string, payload: Record<string, any>, successMsg: string) => {
    const toastId = toast.loading("Processing...");
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        toast.success(successMsg, { id: toastId });

        // Update request state dynamically
        setRequests((prev) =>
          prev.map((r) => {
            if (r.id === id) {
              if (payload.action === "LOCK") {
                return { ...r, status: "IN_REVIEW", review_started: new Date().toISOString() };
              }
              if (payload.action === "UNLOCK") {
                return { ...r, status: "PENDING", review_started: null };
              }
              if (payload.action === "REJECT") {
                return { ...r, status: "REJECTED", reject_reason: payload.reject_reason };
              }
              if (payload.action === "APPROVE") {
                return {
                  ...r,
                  status: "APPROVED",
                  approved_animal_id: json.data?.id,
                  approved_animal: { id: json.data?.id, canonical_slug: json.data?.canonical_slug },
                };
              }
            }
            return r;
          })
        );
        router.refresh();
        return true;
      } else {
        const json = await res.json().catch(() => ({}));
        toast.error(json.message || "Failed to process request action.", { id: toastId });
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.", { id: toastId });
      return false;
    }
  };

  const handleLock = async (id: string) => {
    const success = await handleAction(id, { action: "LOCK" }, "Request locked for review successfully.");
    if (success) {
      router.push(`/admin/requests/${id}/review`);
    }
  };

  const handleUnlock = async (id: string) => {
    await handleAction(id, { action: "UNLOCK" }, "Request review lock released.");
  };

  const handleOpenReject = (req: RequestDetail) => {
    setRejectingRequest(req);
    setRejectReason("");
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }
    if (rejectingRequest) {
      const success = await handleAction(
        rejectingRequest.id,
        { action: "REJECT", reject_reason: rejectReason },
        "Request rejected successfully."
      );
      if (success) setRejectingRequest(null);
    }
  };

  const handleOpenBan = (req: RequestDetail) => {
    setBanningUser({ userId: req.user.id, name: req.user.name || req.user.email });
    setBanDuration("7");
  };

  const handleBanSubmit = async () => {
    if (banningUser) {
      const isPermanent = banDuration === "PERMANENT";
      const days = isPermanent ? undefined : parseInt(banDuration, 10);

      const success = await handleAction(
        requests[0].id, // Any active request ID just to hit the dynamic PATCH endpoint
        {
          action: "BAN",
          userId: banningUser.userId,
          isBanned: true,
          durationDays: days,
        },
        "User request privileges suspended successfully!"
      );
      if (success) {
        // Update user ban status locally in state
        setRequests((prev) =>
          prev.map((r) => {
            if (r.user.id === banningUser.userId) {
              return {
                ...r,
                user: {
                  ...r.user,
                  is_request_banned: isPermanent,
                  request_banned_until: isPermanent
                    ? null
                    : new Date(Date.now() + days! * 24 * 60 * 60 * 1000).toISOString(),
                },
              };
            }
            return r;
          })
        );
        setBanningUser(null);
      }
    }
  };

  const handleUnban = async (userId: string) => {
    const success = await handleAction(
      requests[0].id,
      {
        action: "BAN",
        userId,
        isBanned: false,
      },
      "User request privileges restored and strikes reset!"
    );
    if (success) {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.user.id === userId) {
            return {
              ...r,
              user: {
                ...r.user,
                is_request_banned: false,
                request_banned_until: null,
                rejections_reset_at: new Date().toISOString(),
              },
            };
          }
          return r;
        })
      );
    }
  };

  const handleResetStrikes = async (userId: string) => {
    const userRequest = requests.find((r) => r.user.id === userId);
    if (!userRequest) return;

    const success = await handleAction(
      userRequest.id,
      {
        action: "RESET_STRIKES",
        userId,
      },
      "User strikes reset successfully!"
    );

    if (success) {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.user.id === userId) {
            return {
              ...r,
              user: {
                ...r.user,
                rejections_reset_at: new Date().toISOString(),
              },
            };
          }
          return r;
        })
      );
    }
  };



  const getStrikeCount = (userId: string, rejectionsResetAt?: string | null) => {
    // Dynamic local count based on loaded state respecting reset timestamp
    const resetDate = rejectionsResetAt ? new Date(rejectionsResetAt) : new Date(0);
    return requests.filter(
      (r) => r.user.id === userId && r.status === "REJECTED" && new Date(r.created_at) > resetDate
    ).length;
  };

  const isUserBannedNow = (user: RequestUser) => {
    if (user.is_request_banned) return true;
    if (user.request_banned_until) {
      return new Date(user.request_banned_until) > new Date();
    }
    return false;
  };

  return (
    <div className="w-full mx-auto pb-20 font-['Manrope']">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] uppercase tracking-wider">Pending Animal Requests</h1>
        <p className="text-xs text-[#1a1c19]/50 mt-1">Review community requested animal profiles, correct taxonomy/typos, and approve creations.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-[#e3e3de] pb-4">
        {(["ALL", "PENDING", "IN_REVIEW", "COMPLETED"] as const).map((tab) => (
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

      {/* Table / Grid */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                key={req.id}
                className={cn(
                  "bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6 transition-all",
                  req.status === "IN_REVIEW" && "border-amber-400 bg-amber-50/20"
                )}
              >
                {/* Left side: Image + details */}
                <div className="flex flex-col sm:flex-row gap-6 flex-1">
                  {/* CSS Safety Blur Shield Image container (disabled for approved requests) */}
                  {(() => {
                    const isApproved = req.status === "APPROVED";
                    const level = isApproved ? 1 : getBlurLevel(req.id);
                    return (
                      <div 
                        onClick={() => !isApproved && cycleBlurLevel(req.id)}
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
                        
                            {/* Overlay Controls — only for non-approved requests */}
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
                                  onClick={(e) => resetBlurLevel(req.id, e)}
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
                                onClick={(e) => resetBlurLevel(req.id, e)}
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
                    );
                  })()}

                  {/* Core details */}
                  <div className="space-y-3 flex-1">
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

                    <div>
                      <h2 className="text-md font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans']">{req.animal_name}</h2>
                      {req.scientific_name && (
                        <p className="text-xs italic text-[#1a1c19]/60">{req.scientific_name}</p>
                      )}
                    </div>

                    {/* Requester User details and strike tags */}
                    <div className="bg-[#fafaf5] rounded-xl p-3 border border-[#e3e3de] text-xs space-y-1 max-w-[400px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#1a1c19]/50">Requester:</span>
                        <strong className="text-[#1a1c19]">{req.user.name || req.user.email}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#1a1c19]/50">Strikes (Rejections):</span>
                        <span className={cn(
                          "font-bold",
                          getStrikeCount(req.user.id, req.user.rejections_reset_at) >= 3 ? "text-red-600" : "text-[#1a1c19]"
                        )}>
                          {getStrikeCount(req.user.id, req.user.rejections_reset_at)} / 3
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-[#e3e3de]">
                        <span className="text-[#1a1c19]/50">Privileges status:</span>
                        {isUserBannedNow(req.user) ? (
                          <span className="text-red-600 font-bold uppercase text-[10px]">Suspended</span>
                        ) : (
                          <span className="text-green-600 font-bold uppercase text-[10px]">Active</span>
                        )}
                      </div>

                      {getStrikeCount(req.user.id, req.user.rejections_reset_at) > 0 && (
                        <div className="flex justify-end pt-1.5 border-t border-[#e3e3de] border-dashed">
                          <button
                            type="button"
                            onClick={() => handleResetStrikes(req.user.id)}
                            className="text-[#2d5a27] hover:text-[#1f3f1b] font-bold text-[9px] uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[11px]">refresh</span>
                            Clear Strikes
                          </button>
                        </div>
                      )}
                    </div>

                    {req.status === "REJECTED" && req.reject_reason && (
                      <div className="bg-red-50 text-red-800 rounded-xl p-3 border border-red-200 text-xs mt-2 max-w-[400px]">
                        <span className="font-bold block mb-1">Rejection Reason:</span>
                        <p className="opacity-90">{req.reject_reason}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Operations controls */}
                <div className="flex flex-row md:flex-col justify-end gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#e3e3de] md:border-l md:pl-6 border-dashed border-[#c2c9bb]">
                  {req.status === "PENDING" && (
                    <button
                      onClick={() => handleLock(req.id)}
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
                        onClick={() => handleUnlock(req.id)}
                        className="px-6 py-2.5 border border-amber-300 text-amber-700 hover:bg-amber-50 text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl transition-colors font-semibold"
                      >
                        Cancel Review
                      </button>

                      <button
                        onClick={() => handleOpenReject(req)}
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

                  {/* Manual Suspend/Ban Toggle */}
                  {req.status !== "APPROVED" && (
                    <>
                      {isUserBannedNow(req.user) ? (
                        <button
                          onClick={() => handleUnban(req.user.id)}
                          className="px-4 py-2 border border-green-200 text-green-700 hover:bg-green-50 text-[10px] font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl transition-colors"
                        >
                          Restore Privileges
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenBan(req)}
                          className={cn(
                            "px-4 py-2 border text-[10px] font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl transition-colors",
                            getStrikeCount(req.user.id, req.user.rejections_reset_at) >= 3
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
            ))
          ) : (
            <div className="bg-white border border-[#c2c9bb] border-dashed rounded-2xl p-12 text-center text-[#1a1c19]/40 flex flex-col items-center justify-center min-h-[300px]">
              <span className="material-symbols-outlined text-[48px] text-[#1a1c19]/30 mb-2">inbox</span>
              <p className="text-sm font-semibold">No requests in this queue status.</p>
            </div>
          )}
        </AnimatePresence>
      </div>



      {/* ── Overlay 2: Rejection Input Modal ── */}
      <AnimatePresence>
        {rejectingRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white border border-[#c2c9bb] rounded-2xl w-full max-w-[500px] shadow-2xl p-6 space-y-4"
            >
              <div>
                <h3 className="text-md font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
                  Reject Request: {rejectingRequest.animal_name}
                </h3>
                <p className="text-xs text-[#1a1c19]/50 mt-1">Provide feedback to the user explaining why their request is being rejected.</p>
              </div>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="e.g. Please provide a clear reference image, or double-check the scientific classification."
                className="w-full px-4 py-2.5 border border-[#1a1c19]/10 rounded-xl outline-none focus:border-red-500 text-xs font-['Manrope'] bg-[#fafaf5]/50"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setRejectingRequest(null)}
                  className="px-4 py-2 border border-[#c2c9bb] text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl shadow-sm"
                >
                  Reject & Delete Image
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Overlay 3: Custom Suspensions/Ban Duration Modal ── */}
      <AnimatePresence>
        {banningUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white border border-[#c2c9bb] rounded-2xl w-full max-w-[450px] shadow-2xl p-6 space-y-4"
            >
              <div>
                <h3 className="text-md font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
                  Suspend Privileges
                </h3>
                <p className="text-xs text-[#1a1c19]/50 mt-1">
                  Select the duration for suspending animal request privileges for <strong>{banningUser.name}</strong>.
                </p>
              </div>

              {/* Suspension Options Selector */}
              <div className="space-y-2.5">
                {[
                  { value: "7", label: "🟡 Suspend for 7 Days", desc: "For minor mistakes or accidental incorrect stats." },
                  { value: "30", label: "🟠 Suspend for 30 Days", desc: "For repeat formatting spam or ignoring guidelines." },
                  { value: "PERMANENT", label: "🔴 Ban Permanently", desc: "For deliberate trolling, vulgarity, or dangerous uploads." },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    onClick={() => setBanDuration(opt.value as any)}
                    className={cn(
                      "flex items-start gap-3 p-3 border rounded-xl cursor-pointer hover:bg-[#fafaf5] transition-all",
                      banDuration === opt.value ? "border-[#2d5a27] bg-[#2d5a27]/5" : "border-[#c2c9bb]"
                    )}
                  >
                    <input
                      type="radio"
                      name="ban_duration"
                      checked={banDuration === opt.value}
                      readOnly
                      className="mt-1 accent-[#2d5a27]"
                    />
                    <div className="text-xs">
                      <strong className="block text-[#1a1c19] font-['Plus_Jakarta_Sans']">{opt.label}</strong>
                      <span className="text-[#1a1c19]/50 font-['Manrope']">{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e3e3de]">
                <button
                  onClick={() => setBanningUser(null)}
                  className="px-4 py-2 border border-[#c2c9bb] text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBanSubmit}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl shadow-sm"
                >
                  Apply Suspension
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
