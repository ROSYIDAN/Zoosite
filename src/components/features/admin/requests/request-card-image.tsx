"use client";

import { cn } from "@/lib/utils";

interface RequestCardImageProps {
  imageUrl: string | null;
  isApproved: boolean;
  blurLevel: 3 | 2 | 1;
  requestId: string;
  onCycleBlur: (id: string) => void;
  onResetBlur: (id: string, e: React.MouseEvent) => void;
}

/** Image section with progressive blur shield for content moderation */
export default function RequestCardImage({
  imageUrl,
  isApproved,
  blurLevel,
  requestId,
  onCycleBlur,
  onResetBlur,
}: RequestCardImageProps) {
  const level = isApproved ? 1 : blurLevel;

  return (
    <div
      onClick={() => !isApproved && onCycleBlur(requestId)}
      className={cn(
        "relative w-full sm:w-40 h-40 rounded-xl overflow-hidden shrink-0 border border-[#c2c9bb] transition-all select-none",
        !isApproved && level > 1 ? "cursor-pointer" : "cursor-default"
      )}
    >
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt="Animal uploaded reference"
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              level === 3 && "blur-2xl scale-110",
              level === 2 && "blur-md scale-102",
              level === 1 && "blur-none"
            )}
          />

          {!isApproved && level === 3 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 text-white gap-1.5 p-2 text-center transition-all duration-300">
              <span className="material-symbols-outlined text-[24px] text-amber-400 animate-pulse">shield</span>
              <span className="text-[9px] font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans']">Safety 3x Blur</span>
              <span className="text-[7.5px] opacity-85 uppercase tracking-wide font-medium">Click to inspect</span>
            </div>
          )}

          {!isApproved && level === 2 && (
            <>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[7.5px] font-bold uppercase tracking-widest border border-white/10">
                2x Blur
              </div>
              <button
                type="button"
                onClick={(e) => onResetBlur(requestId, e)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 border border-white/10 transition-colors shadow-md"
                title="Reset to 3x Blur"
              >
                <span className="material-symbols-outlined text-[15px]">lock</span>
              </button>
            </>
          )}

          {!isApproved && level === 1 && (
            <button
              type="button"
              onClick={(e) => onResetBlur(requestId, e)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 border border-white/10 transition-colors shadow-md"
              title="Reset to 3x Blur"
            >
              <span className="material-symbols-outlined text-[15px]">lock</span>
            </button>
          )}
        </>
      ) : (
        <div className="w-full h-full bg-[#fafaf5] flex flex-col items-center justify-center text-[#1a1c19]/30">
          <span className="material-symbols-outlined text-[32px]">image_not_supported</span>
          <span className="text-[10px] font-bold uppercase mt-1">No Image</span>
        </div>
      )}
    </div>
  );
}