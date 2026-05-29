"use client";

import { motion } from "framer-motion";
import { MdCheck, MdClose, MdHelp } from "react-icons/md";
import { cn } from "@/lib/utils";

import { parseMediaUrl } from "@/lib/media-utils";

export interface MultiPickOption {
  id: string;
  label: string;
  imageUrl?: string;
  icon?: React.ReactNode;
  isCorrect: boolean;
}

interface MultiPickQuestionProps {
  question: string;
  options: MultiPickOption[];
  isAnswered: boolean;
  selectedOptionIds: string[];
  onToggleSelect: (optionId: string) => void;
  onSubmit: () => void;
  timedOut?: boolean;
}

export function MultiPickQuestion({
  question,
  options,
  isAnswered,
  selectedOptionIds,
  onToggleSelect,
  onSubmit,
  timedOut,
}: MultiPickQuestionProps) {
  const hasSelection = selectedOptionIds.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full h-full flex flex-col gap-6"
    >
      <div className="text-center">
        <h1 className="font-serif text-3xl md:text-4xl leading-tight mb-2 text-white">
          {question}
        </h1>
        <p className="text-white/60 font-sans">Select all that apply</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = selectedOptionIds.includes(option.id);
          const isCorrect = option.isCorrect;
          const parsedOptionMedia = parseMediaUrl(option.imageUrl);

          let cardClass = "hover:bg-white/10 transition-colors border-transparent cursor-pointer";
          let badge = null;
          let isShake = false;

          if (!isAnswered) {
            if (isSelected) {
              cardClass = "border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] bg-white/10 scale-[1.02]";
            }
          } else {
            // Answered State Reveal
            if (timedOut) {
              // Time's up: keep all cards in neutral, muted, grayscale state
              cardClass = "opacity-40 grayscale cursor-default border-transparent";
            } else if (isSelected && isCorrect) {
              // Picked correctly
              cardClass = "border-green-500 bg-green-500/10 cursor-default";
              badge = (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center shadow-lg z-10">
                  <MdCheck className="text-white" size={14} />
                </div>
              );
            } else if (isSelected && !isCorrect) {
              // Picked wrong
              cardClass = "border-red-500 bg-red-500/10 opacity-80 cursor-default";
              isShake = true;
              badge = (
                <div className="absolute top-2 right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center shadow-lg z-10">
                  <MdClose className="text-white" size={14} />
                </div>
              );
            } else if (!isSelected && isCorrect) {
              // Missed correct answer
              cardClass = "border-dashed border-green-500 bg-black/20 opacity-70 cursor-default";
              badge = (
                <div className="absolute top-2 right-2 border-2 border-green-500 rounded-full w-5 h-5 flex items-center justify-center z-10">
                  <MdCheck className="text-green-500" size={12} />
                </div>
              );
            } else {
              // Neutral (not picked, wrong)
              cardClass = "opacity-40 grayscale cursor-default border-transparent";
            }
          }

          return (
            <motion.button
              key={option.id}
              disabled={isAnswered}
              onClick={() => onToggleSelect(option.id)}
              animate={isShake ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={cn(
                // ADVICE: Adjust min-h-[150px] to make the buttons taller or shorter
                "relative flex flex-col items-center justify-end overflow-hidden border-2 rounded-2xl p-4 min-h-[150px]",
                "bg-white/5 backdrop-blur-md", // Base glass panel
                cardClass
              )}
            >
              {badge}

              {parsedOptionMedia.url ? (
                <img 
                  src={parsedOptionMedia.url} 
                  alt={option.label} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-80"
                  style={parsedOptionMedia.style}
                />
              ) : (
                <div className="text-white/80 mb-auto mt-4 relative z-10 text-3xl md:text-4xl">
                  {option.icon || <MdHelp />}
                </div>
              )}

              {/* Gradient overlay to make text readable over the image */}
              {option.imageUrl && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
              )}

              <span className="font-semibold text-sm md:text-base text-white relative z-10 font-sans text-center line-clamp-1">
                {option.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
