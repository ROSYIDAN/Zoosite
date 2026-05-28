"use client";

import { MdArrowForward } from "react-icons/md";
import { cn } from "@/lib/utils";

interface QuizActionAreaProps {
  isAnswered: boolean;
  questionType: string;
  isLastQuestion: boolean;
  hasMultiSelection: boolean;
  onMultiSubmit: () => void;
  onNext: () => void;
}

export function QuizActionArea({
  isAnswered,
  questionType,
  isLastQuestion,
  hasMultiSelection,
  onMultiSubmit,
  onNext,
}: QuizActionAreaProps) {
  return (
    <div className="w-full flex justify-center py-4 h-24 shrink-0">
      {!isAnswered && questionType === "MULTI_PICK" ? (
        <button
          onClick={onMultiSubmit}
          disabled={!hasMultiSelection}
          className={cn(
            "px-10 py-4 rounded-full font-bold text-lg transition-all duration-300",
            hasMultiSelection
              ? "bg-amber-400 text-black hover:scale-105 shadow-[0_10px_30px_rgba(251,191,36,0.3)]"
              : "bg-white/10 text-white/30 cursor-not-allowed border border-white/10"
          )}
        >
          Submit Answer
        </button>
      ) : (
        <div className={cn(
          "transition-all duration-300",
          isAnswered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}>
          {isAnswered && (
            <button
              onClick={onNext}
              className="bg-amber-400 text-black font-bold text-lg px-10 py-4 rounded-full shadow-[0_10px_30px_rgba(251,191,36,0.3)] flex items-center gap-2 hover:scale-105 transition-transform"
            >
              {isLastQuestion ? "See Results" : "Next Question"}
              <MdArrowForward size={24} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
