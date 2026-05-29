"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { parseMediaUrl } from "@/lib/media-utils";

export interface TrueFalseOption {
  id: string;
  label?: string;
  isCorrect: boolean;
  imageUrl?: string;
}

interface TrueFalseQuestionProps {
  question: string;
  imageUrl?: string;
  options: TrueFalseOption[];
  isAnswered: boolean;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  timedOut?: boolean;
}

export function TrueFalseQuestion({
  question,
  imageUrl,
  options,
  isAnswered,
  selectedOptionId,
  onSelect,
  timedOut,
}: TrueFalseQuestionProps) {
  const parsedQuestionMedia = imageUrl ? parseMediaUrl(imageUrl) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto"
    >
      <div className="flex flex-col gap-4 items-center">
        <h1 className="font-serif text-3xl md:text-5xl text-center leading-tight text-white drop-shadow-md">
          {question}
        </h1>
        {parsedQuestionMedia?.url && (
          <div className="w-full max-w-2xl aspect-video  bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-lg relative">
            <img
              src={parsedQuestionMedia.url}
              alt="Question media"
              className="w-full h-full object-cover"
              style={parsedQuestionMedia.style}
              loading="eager"
              fetchPriority="high"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
        {options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.isCorrect;
          const parsedOptionMedia = option.imageUrl ? parseMediaUrl(option.imageUrl) : null;

          // Use index to determine layout if labels are missing. Usually option 0 is True, 1 is False
          // Or we can rely on isCorrect if it's a fixed True/False, but labels are best.
          const label = option.label || (index === 0 ? "True" : "False");
          const lowerLabel = label.toLowerCase();
          // Detect "True" patterns (English and Indonesian)
          const isTruePattern = lowerLabel === "true" || lowerLabel === "yes" || lowerLabel === "benar" || lowerLabel === "ya";
          // Detect "False" patterns
          const isFalsePattern = lowerLabel === "false" || lowerLabel === "no" || lowerLabel === "salah" || lowerLabel === "tidak";

          // If it matches a pattern, use it. Otherwise, assume index 0 is "True/Blue" and index 1 is "False/Red"
          const isTrueButton = isTruePattern ? true : (isFalsePattern ? false : index === 0);

          let stateClass = isTrueButton
            ? "bg-blue-600/80 hover:bg-blue-500 text-white border-blue-400 shadow-[0_8px_0_rgb(37,99,235)] hover:translate-y-[2px] hover:shadow-[0_6px_0_rgb(37,99,235)]"
            : "bg-red-600/80 hover:bg-red-500 text-white border-red-400 shadow-[0_8px_0_rgb(220,38,38)] hover:translate-y-[2px] hover:shadow-[0_6px_0_rgb(220,38,38)]";

          let isShake = false;

          if (isAnswered) {
            // Remove the 3D button effect once answered
            stateClass = stateClass.replace(/shadow-\[.*?\]/g, "").replace(/hover:translate-y-\[.*?\]/g, "");

            if (timedOut) {
              // Time's up: keep options neutral and muted
              stateClass = "opacity-30 cursor-default text-white border-white/10 grayscale shadow-none translate-y-0";
            } else if (isCorrect) {
              stateClass = "bg-green-500 border-green-400 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)] scale-[1.02] z-10";
            } else if (isSelected && !isCorrect) {
              stateClass = "bg-red-600 border-red-500 text-white scale-[0.98]";
              isShake = true;
            } else {
              stateClass = "opacity-30 cursor-default text-white border-white/10 grayscale";
            }
          }

          return (
            <motion.button
              key={option.id}
              disabled={isAnswered}
              onClick={() => onSelect(option.id)}
              animate={isShake ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={cn(
                "w-full flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl transition-all duration-200 border-2 active:translate-y-[8px] active:shadow-none group relative overflow-hidden",
                stateClass
              )}
            >
              {parsedOptionMedia?.url && (
                <div className="w-40 h-40 md:w-56 md:h-56 mb-6 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
                  <img src={parsedOptionMedia.url} className="w-full h-full object-cover" style={parsedOptionMedia.style} alt="Option media" />
                </div>
              )}



              <span className="text-3xl md:text-5xl font-black font-sans uppercase tracking-wider relative z-10 drop-shadow-md">
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
