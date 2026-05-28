"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuizStore } from "@/store/quiz.store";
import { MOCK_QUIZ_RANKS } from "@/mocks/quiz/ranks.mock";
import { LevelCard } from "@/components/features/quiz/hub/level-card";
import { QuizHubHeader } from "@/components/features/quiz/hub/quiz-hub-header";
import { CurrentRankSection } from "@/components/features/quiz/hub/current-rank-section";

export default function QuizHubPage() {
  const router = useRouter();
  const { unlockedLevels, completedLevels, resetProgress } = useQuizStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isNormalUnlocked = unlockedLevels.includes("normal");
  const isHardUnlocked = unlockedLevels.includes("hard");

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all quiz progress? This will lock all levels again.")) {
      resetProgress();
    }
  };

  if (!isMounted) return null;

  const currentRank = MOCK_QUIZ_RANKS[completedLevels.length] || MOCK_QUIZ_RANKS[0];
  const progress = completedLevels.length; // 0/3 levels completed

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-[#0c0f0d] to-[#111412] text-white">
      <QuizHubHeader onReset={handleReset} />

      <main className="flex-grow flex flex-col items-center px-6 py-12 w-full max-w-4xl mx-auto z-10">

        <CurrentRankSection
          currentRank={currentRank}
          progress={progress}
          totalLevels={3}
        />

        {/* Difficulty Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <LevelCard
            level="easy"
            title="The Basics"
            description="3 questions. Test your fundamental knowledge of the animal kingdom."
            isUnlocked={true}
            isCompleted={completedLevels.includes("easy")}
            onStart={() => router.push("/quiz/easy/ready")}
          />
          <LevelCard
            level="normal"
            title="Intermediate"
            description="Deeper dives into taxonomy and habitats."
            isUnlocked={isNormalUnlocked}
            isCompleted={completedLevels.includes("normal")}
            unlockRequirement="Score 3/3 on Easy"
            onStart={() => isNormalUnlocked && router.push("/quiz/normal/ready")}
          />
          <LevelCard
            level="hard"
            title="Expert"
            description="Tricky silhouettes and advanced facts."
            isUnlocked={isHardUnlocked}
            isCompleted={completedLevels.includes("hard")}
            unlockRequirement="Score 3/3 on Normal"
            onStart={() => isHardUnlocked && router.push("/quiz/hard/ready")}
          />
        </div>
      </main>
    </div>
  );
}
