"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
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

  // Map to the format QuizQuestionRenderer expects
  const typeMap: Record<string, "SINGLE_PICK" | "MULTI_PICK" | "SILHOUETTE" | "TRUE_FALSE"> = {
    SINGLE_PICK_LIST: "SINGLE_PICK",
    MULTI_PICK_GRID: "MULTI_PICK",
    IMAGE_RECOGNITION: "SILHOUETTE",
    TRUE_FALSE: "TRUE_FALSE",
  };

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

  const handleApply = () => {
    setValue("media_url", mediaUrl, { shouldDirty: true });
    setValue("options", options, { shouldDirty: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch bg-black/80 backdrop-blur-sm">
      {/* LEFT: Live Preview */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0c0f0d] overflow-y-auto">
        <div className="w-full max-w-3xl">
          <QuizQuestionRenderer
            currentQuestion={previewQuestion}
            isAnswered={false}
            singleSelectedId={null}
            multiSelectedIds={[]}
            onSingleSelect={() => {}}
            onMultiToggle={() => {}}
            onMultiSubmit={() => {}}
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

          {options.map((opt, index) => {
            if (!opt.media_url) return null;
            return (
              <LayoutControlBlock
                key={`opt-ctrl-${index}`}
                title={`Option: ${opt.label || `Option ${index + 1}`}`}
                url={opt.media_url}
                onChange={(opts) => handleUpdateOptionMedia(index, opts)}
              />
            );
          })}

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

