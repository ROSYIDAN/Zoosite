import { QuizQuestion, QuizOption, MatchPair } from "@/types/quiz.types";

/**
 * Maps database quiz questions (with options) to the format expected by the UI.
 * This handles the conversion of snake_case fields to camelCase and 
 * maps the pattern enums to the UI type strings.
 */
export function mapDbToUiQuestion(dbQuestion: any): QuizQuestion {
  const typeMap: Record<string, QuizQuestion["type"]> = {
    SINGLE_PICK_LIST: "SINGLE_PICK",
    MULTI_PICK_GRID: "MULTI_PICK",
    IMAGE_RECOGNITION: "SILHOUETTE",
    TRUE_FALSE: "TRUE_FALSE",
    MATCHUP: "MATCHUP",
  };

  const isMatchup = dbQuestion.pattern === "MATCHUP";

  // For MATCHUP, parse pipe-separated labels and media_urls into structured pairs
  const matchPairs: MatchPair[] | undefined = isMatchup
    ? dbQuestion.options.map((opt: any) => {
        const [left, right] = (opt.label || "").split("|");
        const [leftImg, rightImg] = (opt.media_url || "").split("|");
        return {
          id: opt.id,
          left: (left || "").trim(),
          right: (right || "").trim(),
          leftImage: (leftImg || "").trim() || undefined,
          rightImage: (rightImg || "").trim() || undefined,
        };
      })
    : undefined;

  return {
    id: dbQuestion.id,
    type: typeMap[dbQuestion.pattern] || "SINGLE_PICK",
    question: dbQuestion.prompt,
    imageUrl: dbQuestion.media_url || undefined,
    options: dbQuestion.options.map((opt: any) => ({
      id: opt.id,
      label: opt.label,
      isCorrect: opt.is_correct,
      imageUrl: opt.media_url || undefined,
    })),
    matchPairs,
  };
}

