"use client";

import { motion, Variants } from "framer-motion";
import { MdClose, MdCheck, MdList, MdGridView, MdImage } from "react-icons/md";
import { cn } from "@/lib/utils";

interface PerformanceSummaryProps {
  results: boolean[];
}

export function PerformanceSummary({ results }: PerformanceSummaryProps) {
  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const questions = [
    { num: 1, type: <MdList size={24} />, isCorrect: results[0] },
    { num: 2, type: <MdGridView size={24} />, isCorrect: results[1] },
    { num: 3, type: <MdImage size={24} />, isCorrect: results[2] },
  ];

  return (
    <motion.div variants={itemVars} className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      {questions.map((q) => (
        <div
          key={q.num}
          className={cn(
            "bg-white/5 backdrop-blur-md rounded-2xl p-4 border flex flex-col items-center relative overflow-hidden",
            q.isCorrect ? "border-green-500/30 shadow-[0_5px_15px_rgba(34,197,94,0.1)]" : "border-red-500/30"
          )}
        >
          <div className="text-white/40 mb-3">{q.type}</div>
          <div className="font-semibold mb-2">Question {q.num}</div>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center", 
            q.isCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}>
            {q.isCorrect ? <MdCheck size={20} /> : <MdClose size={20} />}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
