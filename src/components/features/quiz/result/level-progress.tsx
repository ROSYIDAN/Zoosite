"use client";

import { motion, Variants } from "framer-motion";

interface LevelProgressProps {
  score: number;
  level: string;
}

export function LevelProgress({ score, level }: LevelProgressProps) {
  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div variants={itemVars} className="w-full max-w-2xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-12">
      {score === 3 ? (
        <div className="flex flex-col items-center text-center">
          <span className="bg-green-500/20 text-green-400 text-sm font-bold px-3 py-1 rounded-full border border-green-500/30 uppercase tracking-widest mb-3">
            Level Up
          </span>
          <p className="text-lg">🔓 You have unlocked the next difficulty level!</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <div className="w-full flex justify-between text-sm text-white/60 mb-2">
            <span>Current Level: {level.toUpperCase()}</span>
            <span>{3 - score} more needed to unlock next level</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 transition-all duration-1000" style={{ width: `${(score / 3) * 100}%` }} />
          </div>
        </div>
      )}
    </motion.div>
  );
}
