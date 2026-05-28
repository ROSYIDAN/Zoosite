import { motion } from "framer-motion";

interface RequestStrikeWarningProps {
  rejectionCount: number;
}

export default function RequestStrikeWarning({ rejectionCount }: RequestStrikeWarningProps) {
  if (rejectionCount !== 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 mb-6 shadow-sm font-['Manrope']"
    >
      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
        <span className="material-symbols-outlined text-[20px]">warning</span>
      </div>
      <div>
        <h4 className="text-sm font-bold text-amber-900 font-['Plus_Jakarta_Sans']">Warning: Strikes Active</h4>
        <p className="text-xs text-amber-800/80 leading-relaxed mt-0.5">
          You currently have **2 rejected requests** in your history. If this attempt is also rejected due to trolling or false details, an admin may suspend your animal request privileges. Please double check all taxonomy, stats, and pictures!
        </p>
      </div>
    </motion.div>
  );
}
