import { z } from "zod";

// ── Enums (must match Prisma enums) ──

const quizLevelEnum = z.enum(["EASY", "NORMAL", "HARD"]);
const quizPatternEnum = z.enum(["SINGLE_PICK_LIST", "MULTI_PICK_GRID", "IMAGE_RECOGNITION", "TRUE_FALSE"]);

// ── Query params for GET /api/quiz/questions ──

export const listQuizQuestionsQuerySchema = z.object({
  level: quizLevelEnum,
});

// ── Body for POST /api/admin/quiz/questions ──

const quizOptionInput = z.object({
  label: z.string().optional(),
  is_correct: z.boolean(),
  media_url: z.string().url("Must be a valid URL").or(z.literal("")).optional().nullable(),
});

export const createQuizQuestionSchema = z
  .object({
    id: z.string().uuid().optional(),
    prompt: z.string().min(1, "Prompt is required"),
    level: quizLevelEnum,
    pattern: quizPatternEnum,
    reference_id: z.string().uuid("Must be a valid UUID").or(z.literal("")).optional().nullable(),
    media_url: z.string().url("Must be a valid URL").or(z.literal("")).optional().nullable(),
    options: z.array(quizOptionInput).min(2, "At least 2 options are required"),
  })
  .refine(
    (data) => {
      if (data.pattern === "MULTI_PICK_GRID") {
        const count = data.options.length;
        return count === 3 || count === 6 || count === 9;
      }
      return true;
    },
    {
      message: "Multi Pick must have exactly 3, 6, or 9 answer options.",
      path: ["options"],
    }
  )
  .refine(
    (data) => {
      const correctCount = data.options.filter((o) => o.is_correct).length;
      if (data.pattern === "MULTI_PICK_GRID") {
        return correctCount >= 1;
      }
      return correctCount === 1;
    },
    {
      message: "Correct answer selection is invalid for the chosen pattern.",
      path: ["options"],
    }
  )
  .refine(
    (data) => {
      if (data.pattern === "IMAGE_RECOGNITION") {
        return !!data.media_url && data.media_url.length > 0;
      }
      return true;
    },
    {
      message: "Silhouette image is required for Image Recognition pattern.",
      path: ["media_url"],
    }
  )
  .refine(
    (data) => {
      if (data.pattern === "TRUE_FALSE") {
        return data.options.length === 2;
      }
      return true;
    },
    {
      message: "True/False questions must have exactly 2 options.",
      path: ["options"],
    }
  )
  .refine(
    (data) => {
      return data.options.every(opt => (opt.label && opt.label.length > 0) || (opt.media_url && opt.media_url.length > 0));
    },
    {
      message: "Each option must have either a label or an image.",
      path: ["options"],
    }
  );

// ── Body for POST /api/quiz/verify ──

export const verifyAnswerSchema = z.object({
  question_id: z.string().uuid("question_id must be a valid UUID"),
  selected_option_ids: z.array(z.string().uuid()).min(1, "Must select at least 1 option"),
});

// ── Route param for DELETE /api/admin/quiz/questions/[id] ──

export const quizIdParamSchema = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});

// ── Inferred types ──

export type ListQuizQuestionsQuery = z.infer<typeof listQuizQuestionsQuerySchema>;
export type CreateQuizQuestionInput = z.infer<typeof createQuizQuestionSchema>;
export type VerifyAnswerInput = z.infer<typeof verifyAnswerSchema>;
