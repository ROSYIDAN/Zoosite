"use client";

import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";

interface QuizHubHeaderProps {
  onReset: () => void;
}

export function QuizHubHeader({ onReset }: QuizHubHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 w-full bg-white/5 backdrop-blur-xl border-b border-white/10 z-50 px-6 py-4 flex justify-between items-center">
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <MdArrowBack size={24} />
        <span className="font-semibold hidden sm:inline">Home</span>
      </button>
      <div className="font-serif text-xl tracking-wide font-semibold text-amber-400">
        Animal Quiz
      </div>
      <button
        onClick={onReset}
        className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-red-400 transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
      >
        Reset
      </button>
    </header>
  );
}
