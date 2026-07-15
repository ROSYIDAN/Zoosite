"use client";

import { cn } from "@/lib/utils";
import type { MatchPair } from "@/types/quiz.types";
import { MatchupCard } from "./matchup/matchup-card";
import { MatchupLines } from "./matchup/matchup-lines";
import { MatchupFeedback } from "./matchup/matchup-feedback";
import { useMatchupQuestion, PAIR_COLORS } from "@/hooks/use-matchup-question";

interface MatchupQuestionProps {
  question: string;
  pairs: MatchPair[];
  isAnswered: boolean;
  onComplete: (isCorrect: boolean) => void;
  timedOut?: boolean;
}

export function MatchupQuestion({
  question,
  pairs,
  isAnswered,
  onComplete,
  timedOut,
}: MatchupQuestionProps) {
  const {
    leftItems,
    rightItems,
    selectedLeft,
    links,
    lineCoords,
    containerRef,
    leftRefs,
    rightRefs,
    getMatchColorIndex,
    isLinked,
    handleLeftClick,
    handleRightClick,
  } = useMatchupQuestion({ pairs, isAnswered, onComplete, timedOut });

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
            const leftColor =
              leftColorIdx !== null
                ? PAIR_COLORS[leftColorIdx % PAIR_COLORS.length]
                : null;
            const leftLinked = isLinked("left", leftItem.id);
            const leftActive = selectedLeft === leftItem.id;

            // Right side states & styles
            const rightColorIdx = getMatchColorIndex("right", rightItem.id);
            const rightColor =
              rightColorIdx !== null
                ? PAIR_COLORS[rightColorIdx % PAIR_COLORS.length]
                : null;
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