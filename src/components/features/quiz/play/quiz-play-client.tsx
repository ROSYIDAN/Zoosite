"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuizTopBar } from "@/components/features/quiz/shared/quiz-top-bar";
import { QuizProgressBar } from "@/components/features/quiz/shared/quiz-progress-bar";
import { QuizQuestionRenderer } from "@/components/features/quiz/play/quiz-question-renderer";
import { QuizActionArea } from "@/components/features/quiz/play/quiz-action-area";
import { cn } from "@/lib/utils";

import { QuizOption, QuizQuestion } from "@/types/quiz.types";
import { useQuizStore } from "@/store/quiz.store";

interface QuizPlayClientProps {
  questions: QuizQuestion[];
  level: string;
}

export function QuizPlayClient({ questions, level }: QuizPlayClientProps) {
  const router = useRouter();
  const { unlockLevel, completeLevel } = useQuizStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionResults, setQuestionResults] = useState<boolean[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  // State for different question types
  const [singleSelectedId, setSingleSelectedId] = useState<string | null>(null);
  const [multiSelectedIds, setMultiSelectedIds] = useState<string[]>([]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100;

  // Handlers
  const handleSingleSelect = (id: string) => {
    if (isAnswered) return;
    setSingleSelectedId(id);
    setIsAnswered(true);

    // Track result
    const isCorrect = currentQuestion.options.find((o: QuizOption) => o.id === id)?.isCorrect || false;
    setQuestionResults(prev => [...prev, isCorrect]);
  };

  const handleMultiToggle = (id: string) => {
    if (isAnswered) return;
    setMultiSelectedIds((prev) =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleMultiSubmit = () => {
    setIsAnswered(true);

    // Track result
    const correctIds = currentQuestion.options.filter((o: QuizOption) => o.isCorrect).map((o: QuizOption) => o.id).sort();
    const selectedIds = [...multiSelectedIds].sort();
    const isCorrect = correctIds.length === selectedIds.length && correctIds.every((id, i) => id === selectedIds[i]);
    setQuestionResults(prev => [...prev, isCorrect]);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const score = questionResults.filter(Boolean).length;

      // Persistence logic
      if (score === questions.length) {
        completeLevel(level);

        let nextLevel = "";
        if (level === "easy") nextLevel = "normal";
        if (level === "normal") nextLevel = "hard";

        if (nextLevel) {
          unlockLevel(nextLevel);
        }
      }

      router.push(`/quiz/${level}/result?score=${score}&results=${JSON.stringify(questionResults)}`);
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setSingleSelectedId(null);
      setMultiSelectedIds([]);
    }
  };

  const bgColors = ["from-[#0c0f0d] to-[#1a4d2e]", "from-[#110d0a] to-[#3a2818]", "from-[#08121f] to-[#12284c]"];

  if (!currentQuestion) return null;

  return (
    <div className={cn(
      "h-screen overflow-hidden flex flex-col font-sans relative transition-colors duration-1000 bg-gradient-to-br",
      bgColors[currentIndex % bgColors.length]
    )}>
      <QuizTopBar
        currentQuestion={currentIndex + 1}
        totalQuestions={questions.length}
        showProgress
        backUrl={`/quiz/${level}/ready`}
      />

      <QuizProgressBar progress={progress} />

      <main className="flex-grow flex flex-col items-center px-6 py-4 w-full max-w-3xl mx-auto z-10 overflow-hidden">
        <QuizQuestionRenderer
          currentQuestion={currentQuestion}
          isAnswered={isAnswered}
          singleSelectedId={singleSelectedId}
          multiSelectedIds={multiSelectedIds}
          onSingleSelect={handleSingleSelect}
          onMultiToggle={handleMultiToggle}
          onMultiSubmit={handleMultiSubmit}
        />

        <QuizActionArea
          isAnswered={isAnswered}
          questionType={currentQuestion.type}
          isLastQuestion={isLastQuestion}
          hasMultiSelection={multiSelectedIds.length > 0}
          onMultiSubmit={handleMultiSubmit}
          onNext={handleNext}
        />
      </main>
    </div>
  );
}
