"use client";

import { motion } from "framer-motion";
import { MdCheck, MdClose } from "react-icons/md";
import { cn } from "@/lib/utils";

import { parseMediaUrl } from "@/lib/media-utils";

export interface SinglePickOption {
  id: string;
  label: string;
  isCorrect: boolean;
  imageUrl?: string;
}

interface SinglePickQuestionProps {
  question: string;
  imageUrl?: string;
  options: SinglePickOption[];
  isAnswered: boolean;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  timedOut?: boolean;
}

export function SinglePickQuestion({
  question,
  imageUrl,
  options,
  isAnswered,
  selectedOptionId,
  onSelect,
  timedOut,
}: SinglePickQuestionProps) {
  const letters = ["A", "B", "C", "D"];
  const parsedQuestionMedia = parseMediaUrl(imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full flex flex-col gap-4 md:gap-6"
    >
      <div className="flex flex-col gap-4">
        <h1 className="font-serif text-2xl md:text-3xl text-center leading-tight text-white">
          {question}
        </h1>

        {parsedQuestionMedia.url && (
          <div className="relative w-full aspect-[16/9] max-h-[300px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl mx-auto">
            <img 
              src={parsedQuestionMedia.url} 
              alt="Question" 
              className="w-full h-full object-cover"
              style={parsedQuestionMedia.style}
              loading="eager"
              fetchPriority="high"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 md:gap-3">
        {options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.isCorrect;
          const parsedOptionMedia = parseMediaUrl(option.imageUrl);
          
          let stateClass = "hover:bg-white/10 text-white"; // default
          let badgeClass = "border-white/30 text-white/70 group-hover:border-white/60 group-hover:text-white";
          let badgeContent = <span className="text-sm font-semibold">{letters[index]}</span>;
          let isShake = false;

          if (isAnswered) {
            if (timedOut) {
              // Time's up: keep all options in neutral, non-highlighted, slightly muted state
              stateClass = "opacity-40 cursor-default text-white/50 border-white/5";
              badgeClass = "border-white/10 text-white/30";
            } else if (isCorrect) {
              // Always highlight correct answer green when revealed
              stateClass = "bg-green-500/20 border-green-400 text-green-300";
              badgeClass = "bg-green-500 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]";
              badgeContent = <MdCheck className="text-white" size={16} />;
            } else if (isSelected && !isCorrect) {
              // Highlight wrong selected answer red
              stateClass = "bg-red-500/20 border-red-400 text-red-300";
              badgeClass = "bg-red-500 border-red-500";
              badgeContent = <MdClose className="text-white" size={16} />;
              isShake = true;
            } else {
              // Muted unselected wrong answers
              stateClass = "opacity-50 cursor-default text-white/50 border-white/10";
              badgeClass = "border-white/20 text-white/40";
            }
          }

          return (
            <motion.button
              key={option.id}
              disabled={isAnswered}
              onClick={() => onSelect(option.id)}
              animate={isShake ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={cn(
                "w-full flex items-center p-3 md:p-4 rounded-xl md:rounded-2xl text-left transition-colors group relative overflow-hidden",
                "bg-white/5 backdrop-blur-md border border-white/10", // base glass styling
                stateClass
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-3 md:mr-4 transition-colors shrink-0",
                  "border",
                  badgeClass
                )}
              >
                {badgeContent}
              </div>

              {parsedOptionMedia.url && (
                <div className="w-16 h-12 md:w-24 md:h-16 rounded-lg overflow-hidden border border-white/20 mr-3 md:mr-4 shrink-0 shadow-sm bg-black/20">
                  <img 
                    src={parsedOptionMedia.url} 
                    alt="" 
                    className="w-full h-full p-0.5 object-cover"
                    style={parsedOptionMedia.style}
                  />
                </div>
              )}

              <span className="text-base md:text-lg font-sans flex-1">{option.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
