"use client";

import { motion } from "framer-motion";

interface QuizProgressBarProps {
  progress: number; // 0 to 100
}

export function QuizProgressBar({ progress }: QuizProgressBarProps) {
  return (
    <div className="w-full h-1.5 bg-black/40 relative z-20">
      <motion.div
        className="h-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}
