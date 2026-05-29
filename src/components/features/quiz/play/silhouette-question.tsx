"use client";

import { motion } from "framer-motion";
import { MdCheck, MdClose } from "react-icons/md";
import { cn } from "@/lib/utils";
import { parseMediaUrl } from "@/lib/media-utils";

export interface SilhouetteOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

interface SilhouetteQuestionProps {
  question: string;
  imageUrl: string;
  options: SilhouetteOption[];
  isAnswered: boolean;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
}

export function SilhouetteQuestion({
  question,
  imageUrl,
  options,
  isAnswered,
  selectedOptionId,
  onSelect,
}: SilhouetteQuestionProps) {
  const letters = ["A", "B", "C", "D"];
  const parsedQuestionMedia = parseMediaUrl(imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full flex flex-col gap-4 md:gap-6"
    >
      <h1 className="font-serif text-2xl md:text-4xl text-center leading-tight text-white">
        {question}
      </h1>

      <div className="bg-white/5 backdrop-blur-md w-full aspect-[16/10] md:aspect-[21/9] max-h-[30vh] flex items-center justify-center overflow-hidden relative border border-white/10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        {/* Silhouette Image */}
        {parsedQuestionMedia.url && (
          <img
            src={parsedQuestionMedia.url}
            alt="Animal Silhouette"
            className={cn(
              "w-full h-full object-cover object-center transition-all duration-700 ease-in-out",
              !isAnswered ? "brightness-0" : "brightness-100"
            )}
            style={parsedQuestionMedia.style}
            loading="eager"
            fetchPriority="high"
          />
        )}
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] md:text-xs text-white/50 font-sans">
          Image Recognition
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-3 mt-1 md:mt-2">
        {options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.isCorrect;
          
          let stateClass = "hover:bg-white/10 text-white"; // default
          let badgeClass = "border-white/30 text-white/70 group-hover:border-white/60 group-hover:text-white";
          let badgeContent = <span className="text-xs md:text-sm font-semibold">{letters[index]}</span>;
          let isShake = false;

          if (isAnswered) {
            if (isCorrect) {
              stateClass = "bg-green-500/20 border-green-400 text-green-300";
              badgeClass = "bg-green-500 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]";
              badgeContent = <MdCheck className="text-white" size={14} />;
            } else if (isSelected && !isCorrect) {
              stateClass = "bg-red-500/20 border-red-400 text-red-300";
              badgeClass = "bg-red-500 border-red-500";
              badgeContent = <MdClose className="text-white" size={14} />;
              isShake = true;
            } else {
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
                "w-full flex items-center p-2.5 md:p-4 rounded-xl text-left transition-colors group",
                "bg-white/5 backdrop-blur-md border border-white/10",
                stateClass
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-2 md:mr-3 transition-colors shrink-0",
                  "border",
                  badgeClass
                )}
              >
                {badgeContent}
              </div>
              <span className="text-sm md:text-base font-sans line-clamp-1">{option.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
