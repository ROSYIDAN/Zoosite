"use client";

import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface GuidelinesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuidelinesModal({ isOpen, onOpenChange }: GuidelinesModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(10);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      const alreadyRead = localStorage.getItem("zoosite_guidelines_read") === "true";
      if (!alreadyRead) {
        setIsFirstTime(true);
        setSecondsRemaining(10);

        // Clear any existing timer
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setIsFirstTime(false);
        setSecondsRemaining(0);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  const handleAgree = () => {
    localStorage.setItem("zoosite_guidelines_read", "true");
    onOpenChange(false);
  };

  const isLocked = secondsRemaining > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Prevent manual closing via backdrop/Escape if locked
      if (!isLocked) {
        onOpenChange(open);
      }
    }}>
      <DialogContent 
        className="max-w-lg overflow-hidden border border-[#c2c9bb] bg-[#fafaf5] shadow-2xl rounded-3xl p-0 font-['Manrope']"
        onPointerDownOutside={(e) => {
          if (isLocked) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isLocked) e.preventDefault();
        }}
      >
        {/* Header Hero Area */}
        <div className="bg-[#2d5a27] text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg text-white">
              <span className="material-symbols-outlined text-[28px]">gavel</span>
            </div>
            <div>
              <DialogTitle className="text-white text-lg font-bold font-['Plus_Jakarta_Sans'] tracking-wide">
                Species Suggestions
              </DialogTitle>
              <DialogDescription className="text-white/70 text-xs mt-0.5">
                Conservatory Database Integrity Guidelines
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Guidelines Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <p className="text-[#1a1c19]/70 text-xs leading-relaxed font-medium">
            Welcome to the Scientific Conservatory Contribution Portal! To keep our wildlife archive accurate, educational, and family-friendly, all contributors must observe these core rules:
          </p>

          <div className="space-y-3.5">
            <RuleCard 
              icon="library_books"
              title="1. Scientific Accuracy"
              desc="Only suggest real, scientifically documented animal species. Avoid fictional entries, pets, or breeds. Provide correct class, family, and genus details."
            />
            <RuleCard 
              icon="link"
              title="2. Verifiable Sources"
              desc="Reference reliable educational domains (e.g. Wikipedia, National Geographic) for summaries and stats to allow administrative verification."
            />
            <RuleCard 
              icon="photo_library"
              title="3. High-Quality Reference Images"
              desc="Upload clear, appropriate reference images. Strictly avoid any offensive, inappropriate, or copyrighted/watermarked media."
            />
            <RuleCard 
              icon="warning"
              title="4. Three-Strike Suspension System"
              desc="To deter trolling, every request rejected for false data or inappropriate behavior adds 1 Strike. Reaching 3 strikes results in temporary or permanent privilege bans."
              highlight
            />
          </div>
        </div>

        {/* Dialog Footer Actions */}
        <DialogFooter className="p-6 bg-white border-t border-[#e3e3de] flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-2 text-stone-400">
            {isLocked ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin text-[#2d5a27]">progress_activity</span>
                <span className="text-[11px] font-semibold tracking-wide uppercase font-mono text-[#2d5a27]/80">
                  Reviewing: {secondsRemaining}s remaining
                </span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px] text-green-600 font-bold">verified</span>
                <span className="text-[11px] font-bold tracking-wide uppercase text-green-700">
                  Ready to proceed
                </span>
              </>
            )}
          </div>

          <button
            disabled={isLocked}
            onClick={handleAgree}
            className={cn(
              "w-full sm:w-auto px-6 py-3 rounded-xl font-bold font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-wider transition-all duration-300 shadow-sm",
              isLocked
                ? "bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed"
                : "bg-[#2d5a27] hover:bg-[#1f3f1b] text-white hover:shadow-md cursor-pointer"
            )}
          >
            {isLocked ? `I Understand (${secondsRemaining}s)` : "I Understand & Agree"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface RuleCardProps {
  icon: string;
  title: string;
  desc: string;
  highlight?: boolean;
}

function RuleCard({ icon, title, desc, highlight }: RuleCardProps) {
  return (
    <div className={cn(
      "flex gap-3 p-3.5 rounded-2xl border transition-all duration-200",
      highlight
        ? "bg-rose-50/50 border-rose-100/80 shadow-inner"
        : "bg-white border-[#e3e3de] hover:border-[#2d5a27]/30 hover:shadow-sm"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
        highlight
          ? "bg-rose-100 text-rose-600"
          : "bg-[#2d5a27]/10 text-[#2d5a27]"
      )}>
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      </div>
      <div>
        <h4 className={cn(
          "text-xs font-bold font-['Plus_Jakarta_Sans']",
          highlight ? "text-rose-950" : "text-[#1a1c19]"
        )}>
          {title}
        </h4>
        <p className="text-[11px] text-[#1a1c19]/60 leading-relaxed mt-1 font-medium">
          {desc}
        </p>
      </div>
    </div>
  );
}
