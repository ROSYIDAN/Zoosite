"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function QuizNav() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-primary font-headline">
          Challenge Yourself
        </h2>
      </div>
      
      <Link href="/quiz" className="block relative overflow-hidden rounded-3xl bg-[#0c0f0d] text-white group cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
        
        {/* Background gradient/image simulation */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4d2e] to-[#0c0f0d] opacity-90 transition-opacity group-hover:opacity-100" />
        
        {/* Shimmer Effect on hover */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_2s_infinite] z-0 skew-x-[-20deg]" />

        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                Featured
              </span>
              <span className="text-white/60 text-sm font-semibold tracking-wide">
                Interactive Quiz
              </span>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 group-hover:scale-[1.02] origin-left transition-transform duration-300">
              Zoo Mastermind
            </h3>
            
            <p className="text-white/70 text-lg md:text-xl font-sans">
              Test your knowledge of the animal kingdom. Quick thinking and sharp eyes required!
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.4)] group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-[40px] text-black drop-shadow-md">
                emoji_events
              </span>
            </div>
            <span className="font-semibold text-amber-400 font-sans tracking-wide">Play Now</span>
          </div>
        </div>
      </Link>
    </section>
  );
}
