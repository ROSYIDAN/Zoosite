"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { parseMediaUrl } from "@/lib/media-utils";
import type { MatchPair } from "@/types/quiz.types";

export interface MatchupCardProps {
  side: "left" | "right";
  item: MatchPair;
  onClick: () => void;
  disabled: boolean;
  isAnswered: boolean;
  isLinked: boolean;
  isActive: boolean;
  colorIdx: number | null;
  color: { bg: string; border: string; stroke: string } | null;
  className: string;
}

export const MatchupCard = forwardRef<HTMLButtonElement, MatchupCardProps>(
  (
    {
      side,
      item,
      onClick,
      disabled,
      isAnswered,
      isLinked,
      isActive,
      colorIdx,
      color,
      className,
    },
    ref
  ) => {
    // Determine the label text and image URL depending on the column side
    const label = side === "left" ? item.left : item.right;
    const imageUrl = side === "left" ? item.leftImage : item.rightImage;

    // Parse visual layout styling coordinates
    const media = parseMediaUrl(imageUrl);
    const isFlag = imageUrl?.includes("flag") || imageUrl?.includes("country");

    // Badge alignment classes
    const badgeAlignClass = side === "left" ? "top-1.5 left-1.5" : "top-1.5 right-1.5";

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={cn(className, "cursor-pointer")}
      >
        {/* Floating rounded matching badge */}
        {isLinked && colorIdx !== null && color && (
          <span
            className={cn(
              "absolute w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white z-20 shadow-md border border-white/20",
              badgeAlignClass
            )}
            style={{ backgroundColor: color.stroke }}
          >
            {colorIdx + 1}
          </span>
        )}

        {media.url ? (
          <div className="flex flex-col w-full h-full justify-between">
            {isFlag ? (
              <div className="h-4/5 w-full flex items-center justify-center bg-black/25 p-1.5 shrink-0">
                <img
                  src={media.url}
                  alt={label}
                  className="w-16 h-12 object-cover rounded shadow-md border border-white/10"
                  style={media.style}
                />
              </div>
            ) : (
              <div className="h-4/5 w-full overflow-hidden shrink-0 relative bg-black/20">
                <img
                  src={media.url}
                  alt={label}
                  className="w-full h-full object-cover"
                  style={media.style}
                />
              </div>
            )}
            {label && (
              <div className="h-1/5 w-full flex items-center justify-center bg-black/45 border-t border-white/5 px-1.5 z-10">
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-extrabold tracking-wide uppercase text-white/80 font-['Manrope'] truncate">
                  {label}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center px-1.5 bg-black/15">
            <span className="text-[8px] sm:text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider text-white/90 text-center font-['Manrope'] leading-tight line-clamp-2">
              {label}
            </span>
          </div>
        )}
      </button>
    );
  }
);

MatchupCard.displayName = "MatchupCard";
