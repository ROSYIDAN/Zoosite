"use client";

import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { MdRefresh, MdHome } from "react-icons/md";

interface ResultActionsProps {
  level: string;
}

export function ResultActions({ level }: ResultActionsProps) {
  const router = useRouter();
  
  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div variants={itemVars} className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <button
        onClick={() => router.push(`/quiz/${level}/ready`)}
        className="flex-1 py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <MdRefresh size={20} />
        Retake Quiz
      </button>
      <button
        onClick={() => router.push("/quiz")}
        className="flex-1 py-3 px-6 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-[0_5px_15px_rgba(22,163,74,0.4)]"
      >
        <MdHome size={20} />
        Back to Levels
      </button>
    </motion.div>
  );
}
