import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import type { RequestDetail, RequestUser } from "@/types/admin-requests.types";

type TabFilter = "ALL" | "PENDING" | "IN_REVIEW" | "COMPLETED";

/**
 * Encapsulates all admin request actions: state, filtering, CRUD handlers,
 * strike counting, ban logic, and modal state management.
 */
export function useAdminRequestActions(initialRequests: RequestDetail[]) {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestDetail[]>(initialRequests);
  const [activeTab, setActiveTab] = useState<TabFilter>("ALL");

  // Modal state
  const [rejectingRequest, setRejectingRequest] = useState<RequestDetail | null>(null);
  const [banningUser, setBanningUser] = useState<{ userId: string; name: string } | null>(null);
  const [banDuration, setBanDuration] = useState<"7" | "30" | "PERMANENT">("7");
  const [rejectReason, setRejectReason] = useState("");

  // ── Filtering ──
  const filteredRequests = requests.filter((req) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "COMPLETED") return req.status === "APPROVED" || req.status === "REJECTED";
    return req.status === activeTab;
  });

  // ── Utility helpers ──
  const getStrikeCount = (userId: string, rejectionsResetAt?: string | null) => {
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

  // ── Core API action ──
  const handleAction = async (id: string, payload: Record<string, unknown>, successMsg: string) => {
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

        setRequests((prev) =>
          prev.map((r) => {
            if (r.id === id) {
              if (payload.action === "LOCK") {
                return { ...r, status: "IN_REVIEW" as const, review_started: new Date().toISOString() };
              }
              if (payload.action === "UNLOCK") {
                return { ...r, status: "PENDING" as const, review_started: null };
              }
              if (payload.action === "REJECT") {
                return { ...r, status: "REJECTED" as const, reject_reason: payload.reject_reason as string };
              }
              if (payload.action === "APPROVE") {
                return {
                  ...r,
                  status: "APPROVED" as const,
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

  // ── Action handlers ──
  const handleLock = async (id: string) => {
    const success = await handleAction(id, { action: "LOCK" }, "Request locked for review successfully.");
    if (success) router.push(`/admin/requests/${id}/review`);
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
    if (!banningUser) return;
    const isPermanent = banDuration === "PERMANENT";
    const days = isPermanent ? undefined : parseInt(banDuration, 10);

    const success = await handleAction(
      requests[0].id,
      { action: "BAN", userId: banningUser.userId, isBanned: true, durationDays: days },
      "User request privileges suspended successfully!"
    );
    if (success) {
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
  };

  const handleUnban = async (userId: string) => {
    const success = await handleAction(
      requests[0].id,
      { action: "BAN", userId, isBanned: false },
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
      { action: "RESET_STRIKES", userId },
      "User strikes reset successfully!"
    );
    if (success) {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.user.id === userId) {
            return { ...r, user: { ...r.user, rejections_reset_at: new Date().toISOString() } };
          }
          return r;
        })
      );
    }
  };

  return {
    // State
    requests,
    activeTab,
    setActiveTab,
    filteredRequests,
    // Reject modal
    rejectingRequest,
    setRejectingRequest,
    rejectReason,
    setRejectReason,
    // Ban modal
    banningUser,
    setBanningUser,
    banDuration,
    setBanDuration,
    // Actions
    handleLock,
    handleUnlock,
    handleOpenReject,
    handleRejectSubmit,
    handleOpenBan,
    handleBanSubmit,
    handleUnban,
    handleResetStrikes,
    // Utilities
    getStrikeCount,
    isUserBannedNow,
  };
}