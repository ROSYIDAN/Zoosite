"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const SUSPENSION_OPTIONS = [
  { value: "7", label: "🟡 Suspend for 7 Days", desc: "For minor mistakes or accidental incorrect stats." },
  { value: "30", label: "🟠 Suspend for 30 Days", desc: "For repeat formatting spam or ignoring guidelines." },
  { value: "PERMANENT", label: "🔴 Ban Permanently", desc: "For deliberate trolling, vulgarity, or dangerous uploads." },
] as const;

interface SuspendModalProps {
  userName: string | null;
  banDuration: "7" | "30" | "PERMANENT";
  onDurationChange: (duration: "7" | "30" | "PERMANENT") => void;
  onSubmit: () => void;
  onClose: () => void;
}

/**
 * Modal overlay for selecting suspension duration when banning a user.
 */
export default function SuspendModal({
  userName,
  banDuration,
  onDurationChange,
  onSubmit,
  onClose,
}: SuspendModalProps) {
  if (!userName) return null;

  return (
    <AnimatePresence>
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
              Select the duration for suspending animal request privileges for <strong>{userName}</strong>.
            </p>
          </div>

          {/* Suspension Options Selector */}
          <div className="space-y-2.5">
            {SUSPENSION_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                onClick={() => onDurationChange(opt.value)}
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
              onClick={onClose}
              className="px-4 py-2 border border-[#c2c9bb] text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl shadow-sm"
            >
              Apply Suspension
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}