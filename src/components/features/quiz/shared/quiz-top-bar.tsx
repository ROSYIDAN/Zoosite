"use client";

import { useRouter } from "next/navigation";
import { MdArrowBack, MdClose } from "react-icons/md";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuizTopBarProps {
  currentQuestion?: number;
  totalQuestions?: number;
  showProgress?: boolean;
  backUrl?: string;
  onQuit?: () => void;
}

export function QuizTopBar({
  currentQuestion,
  totalQuestions,
  showProgress = false,
  backUrl = "/quiz",
  onQuit,
}: QuizTopBarProps) {
  const router = useRouter();
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const handleBack = () => {
    router.push(backUrl);
  };

  const handleQuitClick = () => {
    if (onQuit) {
      onQuit();
    } else {
      setShowQuitConfirm(true);
    }
  };

  const confirmQuit = () => {
    router.push("/quiz");
  };

  return (
    <header className="sticky top-0 w-full bg-white/5 backdrop-blur-xl border-b border-white/10 z-50">
      {/* Main Top Bar */}
      <div className="px-6 py-4 flex justify-between items-center relative z-20">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <MdArrowBack size={24} />
          <span className="font-semibold hidden sm:inline font-sans">Back</span>
        </button>

        {showProgress && currentQuestion && totalQuestions && (
          <div className="font-serif text-lg tracking-wide text-amber-400 font-semibold drop-shadow-md">
            Question {currentQuestion} of {totalQuestions}
          </div>
        )}

        <button
          onClick={handleQuitClick}
          className="text-white/60 hover:text-red-400 transition-colors p-2"
          title="Quit Quiz"
        >
          <MdClose size={24} />
        </button>
      </div>

      {/* Slide-down Quit Confirmation */}
      <div
        className={cn(
          "absolute top-full left-0 w-full bg-red-950/90 backdrop-blur-md border-b border-red-500/30 overflow-hidden transition-all duration-300 ease-in-out z-10 flex flex-col sm:flex-row items-center justify-center gap-4 py-3 px-4",
          showQuitConfirm ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible"
        )}
      >
        <span className="text-red-100 font-sans text-sm sm:text-base">Leave the quiz? Progress will be lost.</span>
        <div className="flex gap-2">
          <button
            onClick={() => setShowQuitConfirm(false)}
            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmQuit}
            className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
          >
            Yes, Quit
          </button>
        </div>
      </div>
    </header>
  );
}
