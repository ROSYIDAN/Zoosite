"use client";

import { motion, AnimatePresence } from "framer-motion";

interface RejectModalProps {
  animalName: string | null;
  rejectReason: string;
  onReasonChange: (reason: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

/**
 * Modal overlay for providing a rejection reason when rejecting a request.
 */
export default function RejectModal({
  animalName,
  rejectReason,
  onReasonChange,
  onSubmit,
  onClose,
}: RejectModalProps) {
  if (!animalName) return null;

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
          className="bg-white border border-[#c2c9bb] rounded-2xl w-full max-w-[500px] shadow-2xl p-6 space-y-4"
        >
          <div>
            <h3 className="text-md font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
              Reject Request: {animalName}
            </h3>
            <p className="text-xs text-[#1a1c19]/50 mt-1">
              Provide feedback to the user explaining why their request is being rejected.
            </p>
          </div>

          <textarea
            value={rejectReason}
            onChange={(e) => onReasonChange(e.target.value)}
            rows={4}
            placeholder="e.g. Please provide a clear reference image, or double-check the scientific classification."
            className="w-full px-4 py-2.5 border border-[#1a1c19]/10 rounded-xl outline-none focus:border-red-500 text-xs font-['Manrope'] bg-[#fafaf5]/50"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#c2c9bb] text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider rounded-xl shadow-sm"
            >
              Reject & Delete Image
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}