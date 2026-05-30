"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MatchPair } from "@/types/quiz.types";

export interface MatchupFeedbackProps {
  isAnswered: boolean;
  links: { leftId: string; rightId: string }[];
  pairs: MatchPair[];
  selectedLeft: string | null;
}

export function MatchupFeedback({
  isAnswered,
  links,
  pairs,
  selectedLeft,
}: MatchupFeedbackProps) {
  return (
    <>
      {/* Post-verification feedback lists */}
      {isAnswered && (
        <div className="mt-6 flex flex-col gap-2">
          {links.map((link, idx) => {
            const pair = pairs.find((p) => p.id === link.leftId);
            const isCorrectMatch = pair && pair.id === link.rightId;
            return (
              <motion.div
                key={`result-${idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-['Manrope']",
                  isCorrectMatch
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-red-500/20 text-red-300"
                )}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isCorrectMatch ? "check_circle" : "cancel"}
                </span>
                {pair?.left} →{" "}
                {isCorrectMatch
                  ? pair?.right
                  : `${
                      pairs.find((p) => p.id === link.rightId)?.right
                    } (correct: ${pair?.right})`}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Instruction gameplay hints */}
      {!isAnswered && links.length < pairs.length && (
        <p className="text-center text-white/40 text-xs mt-6 font-['Manrope'] animate-pulse">
          {selectedLeft
            ? "Now tap the matching item on the right →"
            : `Tap a subject on the left to begin matching (${links.length}/${pairs.length})`}
        </p>
      )}

      {!isAnswered && links.length === pairs.length && (
        <p className="text-center text-emerald-400 text-xs mt-6 font-['Manrope'] font-bold animate-pulse">
          All pairs matched! Verifying...
        </p>
      )}
    </>
  );
}
