"use client";

import { useRouter } from "next/navigation";
import { MdEmojiEvents } from "react-icons/md";
import { cn } from "@/lib/utils";

interface ReadyCardProps {
  level: string;
}

export function ReadyCard({ level }: ReadyCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-12 flex flex-col items-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)] w-full">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-20 rounded-full"></div>
        <MdEmojiEvents className="text-[80px] text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] relative z-10" />
      </div>

      <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-balance">
        Ready to Test Your Knowledge?
      </h1>
      
      <p className="text-white/70 text-lg md:text-xl mb-8 max-w-md">
        3 questions. Instant feedback. Think fast!
      </p>

      <div className="mb-10">
        <span className={cn(
          "text-sm font-bold px-4 py-2 rounded-full border uppercase tracking-widest",
          level === 'easy' ? "bg-green-500/20 text-green-400 border-green-500/30" :
          level === 'normal' ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
          "bg-red-500/20 text-red-400 border-red-500/30"
        )}>
          {level} Level
        </span>
      </div>

      <button
        onClick={() => router.push(`/quiz/${level}/play`)}
        className="w-full sm:w-auto min-w-[240px] py-4 px-8 rounded-full bg-green-700 hover:bg-green-600 text-white font-bold text-lg transition-all hover:scale-105 shadow-[0_10px_30px_rgba(21,128,61,0.5)] relative overflow-hidden group"
      >
        <span className="relative z-10">Start Quiz</span>
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite] z-0 skew-x-[-20deg]"></div>
      </button>
    </div>
  );
}
