"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { MatchPair } from "@/types/quiz.types";
import { MatchupCard } from "./matchup/matchup-card";
import { MatchupLines } from "./matchup/matchup-lines";
import { MatchupFeedback } from "./matchup/matchup-feedback";

interface MatchupQuestionProps {
  question: string;
  pairs: MatchPair[];
  isAnswered: boolean;
  onComplete: (isCorrect: boolean) => void;
  timedOut?: boolean;
}

interface MatchLink {
  leftId: string;
  rightId: string;
}

/** Shuffles an array in-place using the Fisher–Yates algorithm. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Color palette for matched pair indicators */
const PAIR_COLORS = [
  { bg: "bg-emerald-500/15", border: "border-emerald-500", stroke: "#10b981" },
  { bg: "bg-sky-500/15", border: "border-sky-500", stroke: "#0ea5e9" },
  { bg: "bg-amber-500/15", border: "border-amber-400", stroke: "#f59e0b" },
  { bg: "bg-violet-500/15", border: "border-violet-500", stroke: "#8b5cf6" },
  { bg: "bg-rose-500/15", border: "border-rose-400", stroke: "#fb7185" },
  { bg: "bg-teal-500/15", border: "border-teal-500", stroke: "#14b8a6" },
];

export function MatchupQuestion({
  question,
  pairs,
  isAnswered,
  onComplete,
  timedOut,
}: MatchupQuestionProps) {
  // Randomize both columns on mount only
  const [leftItems, setLeftItems] = useState(() => shuffle(pairs));
  const [rightItems, setRightItems] = useState(() => shuffle(pairs));

  // Sync shuffled items with pairs prop updates (preserving the shuffled order) so preview adjustments live-update
  useEffect(() => {
    setLeftItems((prev) =>
      prev.map((item) => {
        const updated = pairs.find((p) => p.id === item.id);
        return updated ? { ...item, ...updated } : item;
      })
    );
    setRightItems((prev) =>
      prev.map((item) => {
        const updated = pairs.find((p) => p.id === item.id);
        return updated ? { ...item, ...updated } : item;
      })
    );
  }, [pairs]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [links, setLinks] = useState<MatchLink[]>([]);

  // Refs for SVG line coordinate calculation
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Coordinate state for SVG lines
  const [lineCoords, setLineCoords] = useState<
    { x1: number; y1: number; x2: number; y2: number; color: string; key: string }[]
  >([]);

  // Calculate SVG line coordinates from matched elements
  const recalcLines = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const coords = links
      .map((link, idx) => {
        const leftEl = leftRefs.current[link.leftId];
        const rightEl = rightRefs.current[link.rightId];
        if (!leftEl || !rightEl) return null;

        const lr = leftEl.getBoundingClientRect();
        const rr = rightEl.getBoundingClientRect();

        return {
          x1: lr.right - containerRect.left,
          y1: lr.top + lr.height / 2 - containerRect.top,
          x2: rr.left - containerRect.left,
          y2: rr.top + rr.height / 2 - containerRect.top,
          color: PAIR_COLORS[idx % PAIR_COLORS.length].stroke,
          key: `${link.leftId}-${link.rightId}`,
        };
      })
      .filter(Boolean) as typeof lineCoords;

    setLineCoords(coords);
  }, [links]);

  useEffect(() => {
    recalcLines();
    window.addEventListener("resize", recalcLines);
    return () => window.removeEventListener("resize", recalcLines);
  }, [recalcLines]);

  // Handle timeout: auto-submit with wrong answer
  useEffect(() => {
    if (timedOut && !isAnswered) {
      onComplete(false);
    }
  }, [timedOut, isAnswered, onComplete]);

  // Check if all pairs are matched, then auto-verify
  useEffect(() => {
    if (links.length === pairs.length && !isAnswered) {
      // Verify all matches
      const allCorrect = links.every((link) => {
        const pair = pairs.find((p) => p.id === link.leftId);
        return pair && pair.id === link.rightId;
      });
      onComplete(allCorrect);
    }
  }, [links, pairs, isAnswered, onComplete]);

  // Pre-populate links if isAnswered is true on mount (e.g. in preview modal with Show Answers)
  useEffect(() => {
    if (isAnswered && links.length === 0) {
      const correctLinks = pairs.map((p) => ({ leftId: p.id, rightId: p.id }));
      setLinks(correctLinks);
    }
  }, [isAnswered, pairs, links.length]);

  const getMatchColorIndex = (side: "left" | "right", id: string): number | null => {
    const idx = links.findIndex(
      (l) => (side === "left" ? l.leftId === id : l.rightId === id)
    );
    return idx >= 0 ? idx : null;
  };

  const isLinked = (side: "left" | "right", id: string) =>
    links.some((l) => (side === "left" ? l.leftId === id : l.rightId === id));

  const handleLeftClick = (id: string) => {
    if (isAnswered) return;
    if (isLinked("left", id)) {
      setLinks((prev) => prev.filter((l) => l.leftId !== id));
      return;
    }
    setSelectedLeft(id);
  };

  const handleRightClick = (id: string) => {
    if (isAnswered || !selectedLeft) return;
    if (isLinked("right", id)) {
      setLinks((prev) => prev.filter((l) => l.rightId !== id));
      return;
    }
    // Create a new link
    setLinks((prev) => [...prev, { leftId: selectedLeft, rightId: id }]);
    setSelectedLeft(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Question Prompt */}
      <h2 className="text-center text-white text-xl md:text-2xl font-bold font-['Plus_Jakarta_Sans'] tracking-tight mb-8 px-4">
        {question}
      </h2>

      {/* Matching Grid with SVG overlay */}
      <div ref={containerRef} className="relative">
        {/* SVG overlay canvas for connecting vines */}
        <MatchupLines lineCoords={lineCoords} />

        {/* Row-by-Row Grid Container */}
        <div className="flex flex-col gap-3.5 relative">
          {leftItems.map((_, idx) => {
            const leftItem = leftItems[idx];
            const rightItem = rightItems[idx];

            // Left side states & styles
            const leftColorIdx = getMatchColorIndex("left", leftItem.id);
            const leftColor = leftColorIdx !== null ? PAIR_COLORS[leftColorIdx % PAIR_COLORS.length] : null;
            const leftLinked = isLinked("left", leftItem.id);
            const leftActive = selectedLeft === leftItem.id;

            // Right side states & styles
            const rightColorIdx = getMatchColorIndex("right", rightItem.id);
            const rightColor = rightColorIdx !== null ? PAIR_COLORS[rightColorIdx % PAIR_COLORS.length] : null;
            const rightLinked = isLinked("right", rightItem.id);

            return (
              <div
                key={idx}
                className="grid grid-cols-[1fr_auto_1fr] gap-x-4 md:gap-x-6 items-center w-full max-w-md mx-auto"
              >
                {/* Left Card */}
                <MatchupCard
                  ref={(el) => {
                    leftRefs.current[leftItem.id] = el;
                  }}
                  side="left"
                  item={leftItem}
                  onClick={() => handleLeftClick(leftItem.id)}
                  disabled={isAnswered}
                  isAnswered={isAnswered}
                  isLinked={leftLinked}
                  isActive={leftActive}
                  colorIdx={leftColorIdx}
                  color={leftColor}
                  className={cn(
                    "relative rounded-xl border-2 w-[180px] h-[140px] justify-self-end overflow-hidden flex flex-col justify-between items-center transition-all duration-200 p-0",
                    isAnswered
                      ? leftLinked
                        ? `${leftColor?.bg} ${leftColor?.border} text-white`
                        : "bg-white/5 border-white/10 text-white/30"
                      : leftActive
                      ? "bg-[#2d5a27]/30 border-[#2d5a27] text-white scale-[1.02] shadow-[0_0_16px_rgba(45,90,39,0.3)]"
                      : leftLinked
                      ? `${leftColor?.bg} ${leftColor?.border} text-white opacity-80`
                      : "bg-white/10 border-white/20 text-white hover:bg-white/15 hover:border-white/40 active:scale-[0.98]"
                  )}
                />

                {/* Center Divider Spacer */}
                <div className="w-1 h-8 rounded-full bg-white/10" />

                {/* Right Card */}
                <MatchupCard
                  ref={(el) => {
                    rightRefs.current[rightItem.id] = el;
                  }}
                  side="right"
                  item={rightItem}
                  onClick={() => handleRightClick(rightItem.id)}
                  disabled={isAnswered || !selectedLeft}
                  isAnswered={isAnswered}
                  isLinked={rightLinked}
                  isActive={false}
                  colorIdx={rightColorIdx}
                  color={rightColor}
                  className={cn(
                    "relative rounded-xl border-2 w-[180px] h-[160px] justify-self-start overflow-hidden flex flex-col justify-between items-center transition-all duration-200 p-0",
                    isAnswered
                      ? rightLinked
                        ? `${rightColor?.bg} ${rightColor?.border} text-white`
                        : "bg-white/5 border-white/10 text-white/30"
                      : selectedLeft
                      ? rightLinked
                        ? `${rightColor?.bg} ${rightColor?.border} text-white opacity-80`
                        : "bg-white/10 border-white/20 text-white hover:bg-white/15 hover:border-white/40 active:scale-[0.98]"
                      : rightLinked
                      ? `${rightColor?.bg} ${rightColor?.border} text-white opacity-80`
                      : "bg-white/5 border-white/10 text-white/40 cursor-default"
                  )}
                />
              </div>
            );
          })}
        </div>

        {/* Post-verification feedback & instruction banners */}
        <MatchupFeedback
          isAnswered={isAnswered}
          links={links}
          pairs={pairs}
          selectedLeft={selectedLeft}
        />
      </div>
    </div>
  );
}
