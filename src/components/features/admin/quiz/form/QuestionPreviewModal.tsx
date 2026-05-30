"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { parseMediaUrl, encodeMediaUrl, MediaLayoutOptions } from "@/lib/media-utils";
import { QuizQuestionRenderer } from "@/components/features/quiz/play/quiz-question-renderer";
import { CreateQuizQuestionInput } from "@/lib/validations/quiz.schema";
import { LayoutControlBlock } from "@/components/features/admin/shared/layout-control-block";

interface QuestionPreviewModalProps {
  onClose: () => void;
}

export default function QuestionPreviewModal({ onClose }: QuestionPreviewModalProps) {
  const { getValues, setValue } = useFormContext<CreateQuizQuestionInput>();
  const values = getValues();

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Create local state for preview edits so we don't pollute the main form until "Apply" is clicked
  const [mediaUrl, setMediaUrl] = useState(values.media_url);
  const [options, setOptions] = useState(values.options);
  const [showAnswers, setShowAnswers] = useState(false);

  // Map to the format QuizQuestionRenderer expects
  const typeMap: Record<string, "SINGLE_PICK" | "MULTI_PICK" | "SILHOUETTE" | "TRUE_FALSE" | "MATCHUP"> = {
    SINGLE_PICK_LIST: "SINGLE_PICK",
    MULTI_PICK_GRID: "MULTI_PICK",
    IMAGE_RECOGNITION: "SILHOUETTE",
    TRUE_FALSE: "TRUE_FALSE",
    MATCHUP: "MATCHUP",
  };

  const isMatchup = values.pattern === "MATCHUP";

  const correctOptionIdxs = options
    .map((o, idx) => o.is_correct ? idx : null)
    .filter((v): v is number => v !== null);

  const singleSelectedId = showAnswers && correctOptionIdxs.length > 0
    ? `opt-${correctOptionIdxs[0]}`
    : null;

  const multiSelectedIds = showAnswers
    ? correctOptionIdxs.map(idx => `opt-${idx}`)
    : [];

  const previewQuestion = {
    id: "preview-id",
    type: typeMap[values.pattern] || "SINGLE_PICK",
    question: values.prompt || "Question Prompt Here",
    imageUrl: mediaUrl || undefined,
    options: options.map((opt, i) => ({
      id: `opt-${i}`,
      label: opt.label || `Option ${i + 1}`,
      isCorrect: opt.is_correct,
      imageUrl: opt.media_url || undefined,
    })),
    matchPairs: isMatchup
      ? options.map((opt, i) => {
          const [left, right] = (opt.label || "").split("|");
          const [leftImg, rightImg] = (opt.media_url || "").split("|");
          return {
            id: `opt-${i}`,
            left: (left || "").trim(),
            right: (right || "").trim(),
            leftImage: (leftImg || "").trim() || undefined,
            rightImage: (rightImg || "").trim() || undefined,
          };
        })
      : undefined,
  };

  // Handlers for adjusting layout
  const handleUpdateMainMedia = (newOptions: MediaLayoutOptions) => {
    if (!mediaUrl) return;
    const parsed = parseMediaUrl(mediaUrl);
    if (parsed.url) {
      setMediaUrl(encodeMediaUrl(parsed.url, newOptions));
    }
  };

  const handleUpdateOptionMedia = (index: number, newOptions: MediaLayoutOptions) => {
    const optUrl = options[index].media_url;
    if (!optUrl) return;
    const parsed = parseMediaUrl(optUrl);
    if (parsed.url) {
      const newOptionsArray = [...options];
      newOptionsArray[index] = { ...newOptionsArray[index], media_url: encodeMediaUrl(parsed.url, newOptions) };
      setOptions(newOptionsArray);
    }
  };

  const handleUpdateMatchupMedia = (index: number, side: "left" | "right", newOptions: MediaLayoutOptions) => {
    const optUrl = options[index].media_url || "";
    const [leftImg, rightImg] = optUrl.split("|").map(s => s.trim());
    const targetImg = side === "left" ? leftImg : rightImg;
    if (!targetImg) return;

    const parsed = parseMediaUrl(targetImg);
    if (parsed.url) {
      const updatedImg = encodeMediaUrl(parsed.url, newOptions);
      const newLeft = side === "left" ? updatedImg : (leftImg || "");
      const newRight = side === "right" ? updatedImg : (rightImg || "");
      
      const newOptionsArray = [...options];
      newOptionsArray[index] = {
        ...newOptionsArray[index],
        media_url: `${newLeft}|${newRight}`,
      };
      setOptions(newOptionsArray);
    }
  };

  const handleApply = () => {
    setValue("media_url", mediaUrl, { shouldDirty: true });
    setValue("options", options, { shouldDirty: true });
    onClose();
  };

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
      <div className="w-[400px] bg-white flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-10 shrink-0">
        <div className="p-6 border-b border-[#e3e3de]">
          <h2 className="text-xl font-bold text-[#1a1c19] font-serif">Image Layout Editor</h2>
          <p className="text-sm text-[#72796e] mt-1 font-sans">Adjust how images fit within their containers.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          {mediaUrl && (
            <LayoutControlBlock
              title="Question Media"
              url={mediaUrl}
              onChange={handleUpdateMainMedia}
            />
          )}

          {isMatchup ? (
            options.map((opt, index) => {
              const [leftLabel, rightLabel] = (opt.label || "").split("|");
              const [leftImg, rightImg] = (opt.media_url || "").split("|");
              
              const leftImgTrim = (leftImg || "").trim();
              const rightImgTrim = (rightImg || "").trim();

              if (!leftImgTrim && !rightImgTrim) return null;

              return (
                <div key={`opt-ctrl-matchup-${index}`} className="flex flex-col gap-6 border-b border-[#e3e3de] pb-6 last:border-b-0 last:pb-0">
                  {leftImgTrim && (
                    <LayoutControlBlock
                      title={`Pair ${index + 1} - Left: ${leftLabel || "Left"}`}
                      url={leftImgTrim}
                      onChange={(opts) => handleUpdateMatchupMedia(index, "left", opts)}
                    />
                  )}
                  {rightImgTrim && (
                    <LayoutControlBlock
                      title={`Pair ${index + 1} - Right: ${rightLabel || "Right"}`}
                      url={rightImgTrim}
                      onChange={(opts) => handleUpdateMatchupMedia(index, "right", opts)}
                    />
                  )}
                </div>
              );
            })
          ) : (
            options.map((opt, index) => {
              if (!opt.media_url) return null;
              return (
                <LayoutControlBlock
                  key={`opt-ctrl-${index}`}
                  title={`Option: ${opt.label || `Option ${index + 1}`}`}
                  url={opt.media_url}
                  onChange={(opts) => handleUpdateOptionMedia(index, opts)}
                />
              );
            })
          )}

          {!mediaUrl && !options.some(o => o.media_url) && (
            <div className="text-center text-[#72796e] p-8 bg-[#fafaf5] rounded-xl border border-[#c2c9bb]">
              No images to arrange for this question.
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#e3e3de] flex gap-3 bg-[#fafaf5]">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-[#c2c9bb] text-[#42493e] font-bold text-sm hover:bg-[#e3e3de] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 px-4 rounded-xl bg-[#2d5a27] text-white font-bold text-sm shadow-md hover:bg-[#154212] transition-colors"
          >
            Apply Layout
          </button>
        </div>
      </div>
    </div>
  );
}

