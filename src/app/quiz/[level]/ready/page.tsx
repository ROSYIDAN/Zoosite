"use client";

import { useRouter } from "next/navigation";
import { MdArrowBack, MdClose, MdEmojiEvents } from "react-icons/md";
import { useState, use } from "react";
import { cn } from "@/lib/utils";
import { QuizTopBar } from "@/components/features/quiz/shared/quiz-top-bar";
import { ReadyCard } from "@/components/features/quiz/ready/ready-card";

export default function QuizReadyPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = use(params);

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden bg-gradient-to-br from-[#0c0f0d] to-[#1a4d2e] text-white">
      
      {/* Background Watermark */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-[-10%] right-[-5%] opacity-10 blur-sm transform scale-150 text-[400px]">
          🦁
        </div>
      </div>

      <QuizTopBar backUrl="/quiz" />

      <main className="flex-grow flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto z-10">
        <ReadyCard level={level} />
        
        <div className="mt-8 text-white/40 text-sm">
          You need 3/3 to unlock the next level
        </div>
      </main>
    </div>
  );
}
