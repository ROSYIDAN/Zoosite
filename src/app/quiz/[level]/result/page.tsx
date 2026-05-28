"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, use, Suspense } from "react";
import confetti from "canvas-confetti";
import { motion, Variants } from "framer-motion";
import { MdClose } from "react-icons/md";
import { ResultHero } from "@/components/features/quiz/result/result-hero";
import { PerformanceSummary } from "@/components/features/quiz/result/performance-summary";
import { LevelProgress } from "@/components/features/quiz/result/level-progress";
import { ResultActions } from "@/components/features/quiz/result/result-actions";
import { cn } from "@/lib/utils";

function ResultContent({ level }: { level: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scoreParam = searchParams.get("score");
  const resultsParam = searchParams.get("results");
  const score = scoreParam ? parseInt(scoreParam, 10) : 0;
  const results = resultsParam ? JSON.parse(resultsParam) as boolean[] : [false, false, false];

  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Score counter animation
    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedScore(Math.round((score / steps) * currentStep));
      if (currentStep >= steps) clearInterval(timer);
    }, stepTime);

    // Confetti if perfect
    if (score === 3) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FCD34D', '#10B981', '#3B82F6']
        });
      }, 500);
    }

    return () => clearInterval(timer);
  }, [score]);

  // Rank Logic
  let rank = { title: "Hatching Chick", icon: "🥚", message: "Don't worry — every expert was once a beginner." };
  let bgGradient = "from-[#0c0f0d] to-[#111412]"; // Neutral

  if (score === 3) {
    rank = { title: "Zoo Mastermind!", icon: "👑", message: "Perfect! You've unlocked the next level." };
    bgGradient = "from-[#1a1005] to-[#3d2e0a]"; // Victory Gold
  } else if (score === 2) {
    rank = { title: "Savannah Scout", icon: "🦒", message: "So close! Try again to unlock the next level." };
    bgGradient = "from-[#1a1505] to-[#2b1f13]"; // Amber
  } else if (score === 1) {
    rank = { title: "Curious Cub", icon: "🐾", message: "Keep exploring, you'll get there!" };
    bgGradient = "from-[#0a1929] to-[#111412]"; // Cool Blue
  }

  // Animation variants for staggered entrance
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className={cn("min-h-screen flex flex-col font-sans relative overflow-x-hidden text-white transition-colors duration-1000", `bg-gradient-to-br ${bgGradient}`)}>

      {/* Minimal Top Bar */}
      <header className="w-full bg-transparent z-50 px-6 py-4 flex justify-between items-center absolute top-0">
        <div className="font-semibold text-white/60">Quiz Complete</div>
        <button
          onClick={() => router.push("/quiz")}
          className="text-white/60 hover:text-white transition-colors p-2 bg-white/5 rounded-full backdrop-blur-sm"
        >
          <MdClose size={24} />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto z-10 pt-20">

        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="w-full flex flex-col items-center"
        >
          <ResultHero rank={rank} score={score} animatedScore={animatedScore} />
          
          <PerformanceSummary results={results} />

          <LevelProgress score={score} level={level} />

          <ResultActions level={level} />
        </motion.div>
      </main>
    </div>
  );
}

export default function QuizResultPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = use(params);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0c0f0d] flex justify-center items-center text-white">Loading...</div>}>
      <ResultContent level={level} />
    </Suspense>
  );
}
