"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { RequestDetail } from "@/types/admin-requests.types";
import RequestCardImage from "./request-card-image";
import RequestCardDetails from "./request-card-details";
import RequestCardActions from "./request-card-actions";

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

/** Single request card — orchestrates image, details, and action sub-components */
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
        <RequestCardImage
          imageUrl={req.image_url}
          isApproved={req.status === "APPROVED"}
          blurLevel={blurLevel}
          requestId={req.id}
          onCycleBlur={onCycleBlur}
          onResetBlur={onResetBlur}
        />

        <RequestCardDetails
          req={req}
          strikeCount={strikeCount}
          isBanned={isBanned}
          onResetStrikes={onResetStrikes}
        />
      </div>

      {/* Right side: Action controls */}
      <RequestCardActions
        req={req}
        strikeCount={strikeCount}
        isBanned={isBanned}
        onLock={onLock}
        onUnlock={onUnlock}
        onReject={onReject}
        onBan={onBan}
        onUnban={onUnban}
      />
    </motion.div>
  );
}