"use client";

import { useQuizStore } from "@/store/quiz.store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MdLock, MdCheckCircle, MdOutlineHelpOutline } from "react-icons/md";

export function MasteryGate({ children }: { children: React.ReactNode }) {
  const { completedLevels } = useQuizStore();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ponytail: return null for hydration gate — delay is <1 frame, no visual needed.
  // Upgrade to skeleton if MasteryGate ever does async data fetching client-side.
  if (!isMounted) return null;

  const isUnlocked = completedLevels.includes("hard");

  if (isUnlocked) {
    return <>{children}</>;
  }

  const hasEasy = completedLevels.includes("easy");
  const hasNormal = completedLevels.includes("normal") || completedLevels.includes("medium");
  const hasHard = completedLevels.includes("hard");

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col items-center select-none">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-[#fafaf5]/80 dark:bg-[#1a1c19]/80 border border-[#1a1c19]/5 dark:border-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center relative overflow-hidden"
      >
        {/* Glowing lock decorative icon */}
        <div className="relative mb-8 w-20 h-20 mx-auto bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <MdLock size={44} />
        </div>

        <h2 className="text-3xl font-bold font-serif text-[#154212] dark:text-[#d0e8c5] mb-4 tracking-tight">
          Secret Portal Discovered! 🔒
        </h2>
        
        <p className="text-stone-600 dark:text-stone-300 font-sans text-base max-w-xl mx-auto leading-relaxed mb-10">
          You have located the **Species Contribution System**. To help maintain scientific conservatory standards, animal submissions are locked until you prove your zoological mastery! Beat the quizzes below to unlock.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
          <ProgressBadge levelName="Easy Quiz" isCompleted={hasEasy} />
          <ProgressBadge levelName="Normal Quiz" isCompleted={hasNormal} />
          <ProgressBadge levelName="Hard Quiz" isCompleted={hasHard} />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/quiz")}
          className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-base px-10 py-5 rounded-2xl shadow-[0_12px_30px_rgba(245,158,11,0.3)] transition-all flex items-center gap-3 mx-auto"
        >
          Enter the Quiz Arena
          <span className="material-symbols-outlined font-black">arrow_forward</span>
        </motion.button>
      </motion.div>
    </div>
  );
}

function ProgressBadge({ levelName, isCompleted }: { levelName: string; isCompleted: boolean }) {
  return (
    <div className={`p-5 rounded-2xl border flex flex-col items-center gap-2.5 transition-all ${
      isCompleted
        ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300 shadow-[0_8px_20px_rgba(34,197,94,0.05)] font-semibold"
        : "bg-[#f4f4ef]/50 dark:bg-zinc-800/40 border-stone-200 dark:border-zinc-800 text-stone-400"
    }`}>
      {isCompleted ? (
        <MdCheckCircle size={28} className="text-green-500" />
      ) : (
        <MdOutlineHelpOutline size={28} className="text-stone-300 dark:text-stone-700 animate-pulse" />
      )}
      <span className="font-semibold text-sm tracking-wide uppercase">{levelName}</span>
      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black/5 dark:bg-white/5">
        {isCompleted ? "Completed" : "Locked"}
      </span>
    </div>
  );
}
