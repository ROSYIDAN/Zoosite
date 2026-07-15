import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { parseMediaUrl, encodeMediaUrl, MediaLayoutOptions } from "@/lib/media-utils";
import { CreateQuizQuestionInput } from "@/lib/validations/quiz.schema";

interface UseQuestionPreviewProps {
  onClose: () => void;
}

export function useQuestionPreview({ onClose }: UseQuestionPreviewProps) {
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
    .map((o, idx) => (o.is_correct ? idx : null))
    .filter((v): v is number => v !== null);

  const singleSelectedId = showAnswers && correctOptionIdxs.length > 0
    ? `opt-${correctOptionIdxs[0]}`
    : null;

  const multiSelectedIds = showAnswers
    ? correctOptionIdxs.map((idx) => `opt-${idx}`)
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
      newOptionsArray[index] = {
        ...newOptionsArray[index],
        media_url: encodeMediaUrl(parsed.url, newOptions),
      };
      setOptions(newOptionsArray);
    }
  };

  const handleUpdateMatchupMedia = (index: number, side: "left" | "right", newOptions: MediaLayoutOptions) => {
    const optUrl = options[index].media_url || "";
    const [leftImg, rightImg] = optUrl.split("|").map((s) => s.trim());
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

  return {
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
  };
}