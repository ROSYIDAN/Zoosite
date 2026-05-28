"use client";

import { useState } from "react";
import { parseMediaUrl } from "@/lib/media-utils";
import { cn } from "@/lib/utils";

interface SelectedPreviewProps {
  url: string;
  isLinked: boolean;
  onClear: () => void;
  disableBlur?: boolean;
}

export default function SelectedPreview({ url, isLinked, onClear, disableBlur = false }: SelectedPreviewProps) {
  const parsed = parseMediaUrl(url);
  const shouldBlur = !disableBlur && !isLinked;
  const [blurLevel, setBlurLevel] = useState<3 | 2 | 1>(shouldBlur ? 3 : 1);

  const handleContainerClick = () => {
    if (!shouldBlur) return;
    // Cycle blur level down (3 -> 2 -> 1)
    if (blurLevel === 3) {
      setBlurLevel(2);
    } else if (blurLevel === 2) {
      setBlurLevel(1);
    }
  };

  const resetBlur = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shouldBlur) return;
    setBlurLevel(3);
  };

  return (
    <div 
      onClick={handleContainerClick}
      className={cn(
        "relative rounded-xl overflow-hidden border border-[#c2c9bb] bg-[#fafaf5] aspect-video max-h-56 flex items-center justify-center group/preview transition-all duration-300 select-none",
        blurLevel > 1 ? "cursor-pointer" : "cursor-default"
      )}
    >
      {/* The Image */}
      <img
        src={parsed.url || url}
        alt="Selected animal"
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          blurLevel === 3 && "blur-2xl scale-110",
          blurLevel === 2 && "blur-md scale-102",
          blurLevel === 1 && "blur-none"
        )}
        style={parsed.style}
      />

      {/* Level 3 Center Overlay Warning (Maximum protection) */}
      {blurLevel === 3 && (
        <div className="absolute inset-0 bg-black/25 flex flex-col items-center justify-center p-4 transition-opacity">
          <div className="bg-black/60 backdrop-blur-md text-white border border-white/20 rounded-2xl p-3.5 flex flex-col items-center text-center shadow-lg max-w-[85%] scale-95 group-hover/preview:scale-100 transition-all duration-300">
            <span className="material-symbols-outlined text-[28px] text-amber-400 animate-pulse mb-1">
              shield
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans']">
              Safety Shield Active
            </span>
            <span className="text-[9px] text-white/80 mt-0.5 font-['Manrope'] font-medium">
              3x Max Blur • Click image to inspect outline
            </span>
          </div>
        </div>
      )}

      {/* Level 2 Center Overlay Warning (Medium protection) */}
      {blurLevel === 2 && (
        <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center p-4 transition-opacity">
          <div className="bg-black/60 backdrop-blur-md text-white border border-white/15 rounded-full px-3.5 py-1.5 flex items-center gap-2 shadow-md">
            <span className="material-symbols-outlined text-[16px] text-amber-300">
              visibility_off
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans']">
              2x Medium Blur • Click to fully reveal
            </span>
          </div>
        </div>
      )}

      {/* Sleek bottom control bar floating on the image (visible on hover, or persistent when blurred) */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={cn(
          "absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full flex items-center gap-3 shadow-lg z-10 transition-all duration-300",
          shouldBlur && blurLevel > 1 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-2 group-hover/preview:opacity-100 group-hover/preview:translate-y-0"
        )}
      >
        {/* Blur controls — only for unlinked/community uploaded images */}
        {shouldBlur && (
          <>
            <div className="flex items-center bg-white/10 p-0.5 rounded-full border border-white/5">
              <button
                type="button"
                onClick={() => setBlurLevel(3)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[9px] font-bold transition-all uppercase tracking-wider font-['Plus_Jakarta_Sans']",
                  blurLevel === 3 
                    ? "bg-white text-black shadow-sm" 
                    : "text-white/60 hover:text-white"
                )}
              >
                3x
              </button>
              <button
                type="button"
                onClick={() => setBlurLevel(2)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[9px] font-bold transition-all uppercase tracking-wider font-['Plus_Jakarta_Sans']",
                  blurLevel === 2 
                    ? "bg-white text-black shadow-sm" 
                    : "text-white/60 hover:text-white"
                )}
              >
                2x
              </button>
              <button
                type="button"
                onClick={() => setBlurLevel(1)}
                className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-bold transition-all uppercase tracking-wider font-['Plus_Jakarta_Sans']",
                  blurLevel === 1 
                    ? "bg-[#2d5a27] text-white shadow-sm" 
                    : "text-white/60 hover:text-white"
                )}
              >
                Clear
              </button>
            </div>

            {/* Vertical divider */}
            <div className="h-4 w-px bg-white/20" />

            {/* Reset button (Security Lock) */}
            <button
              type="button"
              onClick={resetBlur}
              disabled={blurLevel === 3}
              className={cn(
                "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans'] transition-colors",
                blurLevel === 3 
                  ? "text-white/30 cursor-not-allowed" 
                  : "text-amber-400 hover:text-amber-300"
              )}
              title="Reset Blur (Lock Image)"
            >
              <span className="material-symbols-outlined text-[15px]">lock</span>
              <span>Reset</span>
            </button>

            {/* Vertical divider */}
            <div className="h-4 w-px bg-white/20" />
          </>
        )}

        {/* Delete action button */}
        <button
          type="button"
          onClick={onClear}
          className="text-[#ffb4ab] hover:text-red-400 flex items-center p-0.5 transition-colors"
          title="Remove image"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
        </button>
      </div>

      {/* Top left type badge */}
      <div className="absolute top-3 left-3 pointer-events-none">
        <span className="bg-black/60 backdrop-blur-sm text-white/80 border border-white/10 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest font-['Plus_Jakarta_Sans']">
          {isLinked ? "Linked" : "Uploaded"}
        </span>
      </div>
    </div>
  );
}

