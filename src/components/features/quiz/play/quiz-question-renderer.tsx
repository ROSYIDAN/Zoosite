"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SinglePickQuestion } from "./single-pick-question";
import { MultiPickQuestion } from "./multi-pick-question";
import { SilhouetteQuestion } from "./silhouette-question";
import { TrueFalseQuestion } from "./true-false-question";

interface QuizQuestionRendererProps {
  currentQuestion: any;
  isAnswered: boolean;
  singleSelectedId: string | null;
  multiSelectedIds: string[];
  onSingleSelect: (id: string) => void;
  onMultiToggle: (id: string) => void;
  onMultiSubmit: () => void;
}

export function QuizQuestionRenderer({
  currentQuestion,
  isAnswered,
  singleSelectedId,
  multiSelectedIds,
  onSingleSelect,
  onMultiToggle,
  onMultiSubmit,
}: QuizQuestionRendererProps) {
  return (
    <div className="flex-grow w-full flex items-center justify-center min-h-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col justify-center"
        >
          {currentQuestion.type === "SINGLE_PICK" && (
            <SinglePickQuestion
              question={currentQuestion.question}
              imageUrl={currentQuestion.imageUrl}
              options={currentQuestion.options}
              isAnswered={isAnswered}
              selectedOptionId={singleSelectedId}
              onSelect={onSingleSelect}
            />
          )}

          {currentQuestion.type === "MULTI_PICK" && (
            <MultiPickQuestion
              question={currentQuestion.question}
              options={currentQuestion.options}
              isAnswered={isAnswered}
              selectedOptionIds={multiSelectedIds}
              onToggleSelect={onMultiToggle}
              onSubmit={onMultiSubmit}
            />
          )}

{/* SILHOUETTE is currently disabled by user request */}
          {/* currentQuestion.type === "SILHOUETTE" && (
            <SilhouetteQuestion
              question={currentQuestion.question}
              imageUrl={currentQuestion.imageUrl!}
              options={currentQuestion.options}
              isAnswered={isAnswered}
              selectedOptionId={singleSelectedId}
              onSelect={onSingleSelect}
            />
          ) */}

          {currentQuestion.type === "TRUE_FALSE" && (
            <TrueFalseQuestion
              question={currentQuestion.question}
              imageUrl={currentQuestion.imageUrl}
              options={currentQuestion.options}
              isAnswered={isAnswered}
              selectedOptionId={singleSelectedId}
              onSelect={onSingleSelect}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
