"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { QuizQuestionRenderer } from "@/components/features/quiz/play/quiz-question-renderer";
import { useQuestionPreview } from "@/hooks/use-question-preview";
import { QuestionPreviewControls } from "./QuestionPreviewControls";

interface QuestionPreviewModalProps {
  onClose: () => void;
}

export default function QuestionPreviewModal({ onClose }: QuestionPreviewModalProps) {
  const {
    mediaUrl,
    options,
    showAnswers,
    setShowAnswers,
    previewQuestion,
    singleSelectedId,
    multiSelectedIds,
    isMatchup,
    handleUpdateMainMedia,
    handleUpdateOptionMedia,
    handleUpdateMatchupMedia,
    handleApply,
  } = useQuestionPreview({ onClose });

  return (
    <div className="fixed inset-0 z-50 flex items-stretch bg-black/80 backdrop-blur-sm">
      {/* LEFT: Live Preview */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0c0f0d] overflow-y-auto relative">
        {/* Answer Key Toggle */}
        <div className="absolute top-6 left-8 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-lg z-20">
          <span className="text-xs font-semibold text-white/80 font-['Manrope']">Show Answer Key</span>
          <button
            type="button"
            onClick={() => setShowAnswers(!showAnswers)}
            className={cn(
              "w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none flex items-center",
              showAnswers ? "bg-[#bcf0ae]" : "bg-white/20"
            )}
          >
            <motion.div
              layout
              className={cn(
                "w-4 h-4 rounded-full shadow-md transition-transform duration-200",
                showAnswers ? "bg-[#002201] translate-x-6" : "bg-white translate-x-0"
              )}
            />
          </button>
        </div>

        <div className="w-full max-w-3xl">
          <QuizQuestionRenderer
            currentQuestion={previewQuestion}
            isAnswered={showAnswers}
            singleSelectedId={singleSelectedId}
            multiSelectedIds={multiSelectedIds}
            onSingleSelect={() => {}}
            onMultiToggle={() => {}}
            onMultiSubmit={() => {}}
            onMatchupComplete={() => {}}
          />
        </div>
      </div>

      {/* RIGHT: Layout Editor Controls */}
      <QuestionPreviewControls
        mediaUrl={mediaUrl}
        isMatchup={isMatchup}
        options={options}
        onClose={onClose}
        handleApply={handleApply}
        handleUpdateMainMedia={handleUpdateMainMedia}
        handleUpdateOptionMedia={handleUpdateOptionMedia}
        handleUpdateMatchupMedia={handleUpdateMatchupMedia}
      />
    </div>
  );
}