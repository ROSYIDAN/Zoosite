"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface ResultHeroProps {
  rank: {
    title: string;
    icon: string;
    message: string;
  };
  score: number;
  animatedScore: number;
}

export function ResultHero({ rank, score, animatedScore }: ResultHeroProps) {
  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div variants={itemVars} className="flex flex-col items-center mb-12 text-center">
      <div className="text-[96px] mb-2 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
        {rank.icon}
      </div>
      <h1 className="font-serif text-5xl font-bold mb-6">{rank.title}</h1>

      <div className="flex items-baseline gap-2 mb-4">
        <span className={cn(
          "text-7xl font-bold font-serif", 
          score === 3 ? "text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" : "text-white"
        )}>
          {animatedScore}
        </span>
        <span className="text-4xl text-white/40">/ 3</span>
      </div>

      <p className="text-xl text-white/70">{rank.message}</p>
    </motion.div>
  );
}
