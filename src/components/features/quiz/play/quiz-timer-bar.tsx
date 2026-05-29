"use client";

import { motion } from "framer-motion";

interface QuizTimerBarProps {
  timeLeft: number;
  totalDuration: number;
  isAnswered: boolean;
}

export function QuizTimerBar({ timeLeft, totalDuration, isAnswered }: QuizTimerBarProps) {
  // Ensure percentage stays between 0 and 100
  const percentage = Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100));

  // Determine dynamic bar color based on percentage remaining
  let barColor = "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]";
  if (percentage <= 30) {
    barColor = "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]";
  } else if (percentage <= 60) {
    barColor = "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]";
  }

  // Visual intensity mode when timeLeft <= 3 seconds, not yet answered, and timer is active
  const isCritical = timeLeft <= 3 && !isAnswered && timeLeft > 0;

  return (
    <div className="w-full max-w-3xl mx-auto px-6 mt-2 relative z-20 select-none">
      <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/10 relative">
        <motion.div
          className={`h-full ${barColor} transition-colors duration-300`}
          initial={{ width: "100%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.05, ease: "linear" }}
        />
        
        {/* Pulsing overlay for critical urgency */}
        {isCritical && (
          <motion.div
            className="absolute inset-0 bg-red-500/20 pointer-events-none"
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
          />
        )}
      </div>

      <div className="flex justify-between items-center mt-1.5 text-xs font-semibold uppercase tracking-wider">
        <span className="text-white/40">Time Remaining</span>
        <motion.span
          className={isCritical ? "text-red-400 font-black text-sm tracking-widest" : "text-white/60"}
          animate={
            isCritical
              ? {
                  scale: [1, 1.25, 1],
                  textShadow: [
                    "0 0 0px rgba(239, 68, 68, 0)",
                    "0 0 12px rgba(239, 68, 68, 0.8)",
                    "0 0 0px rgba(239, 68, 68, 0)",
                  ],
                }
              : {}
          }
          transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
        >
          {timeLeft.toFixed(1)}s
        </motion.span>
      </div>
    </div>
  );
}
