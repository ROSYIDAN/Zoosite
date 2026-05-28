import { prisma } from "@/lib/prisma";
import { Prisma, QuizLevel } from "@prisma/client";
import type { CreateQuizQuestionInput } from "@/lib/validations/quiz.schema";

// ── Select shapes ──

/** User-facing: excludes is_correct to prevent cheating */
const questionForUserSelect = {
  id: true,
  prompt: true,
  level: true,
  pattern: true,
  media_url: true,
  options: {
    select: {
      id: true,
      label: true,
      media_url: true,
    },
  },
} satisfies Prisma.quiz_questionsSelect;

/** Admin-facing: includes is_correct */
const questionForAdminSelect = {
  id: true,
  prompt: true,
  level: true,
  pattern: true,
  reference_id: true,
  media_url: true,
  created_at: true,
  options: {
    select: {
      id: true,
      label: true,
      is_correct: true,
      media_url: true,
    },
  },
} satisfies Prisma.quiz_questionsSelect;

// ── Repository ──

export const quizRepo = {
  /**
   * Fetch questions for a given level WITHOUT correct answer info.
   * Used by the public quiz endpoint.
   */
  async findQuestionsByLevel(level: QuizLevel) {
    return prisma.quiz_questions.findMany({
      where: { level },
      select: questionForUserSelect,
      orderBy: { created_at: "asc" },
    });
  },

  /**
   * Fetch ALL questions WITH correct answer info (for Admin table).
   */
  async findAllForAdmin(filters?: { level?: QuizLevel; pattern?: string }) {
    const where: Prisma.quiz_questionsWhereInput = {};

    if (filters?.level) {
      where.level = filters.level;
    }

    return prisma.quiz_questions.findMany({
      where,
      select: questionForAdminSelect,
      orderBy: { created_at: "desc" },
    });
  },

  /**
   * Fetch the correct option IDs for a specific question.
   * Used by the verify endpoint.
   */
  async findCorrectOptionIds(questionId: string) {
    const options = await prisma.quiz_options.findMany({
      where: { question_id: questionId, is_correct: true },
      select: { id: true },
    });
    return options.map((o) => o.id);
  },

  /**
   * Check if a question exists.
   */
  async findById(id: string) {
    return prisma.quiz_questions.findUnique({
      where: { id },
      select: { id: true },
    });
  },

  /**
   * Fetch full question details for editing.
   */
  async findFullById(id: string) {
    return prisma.quiz_questions.findUnique({
      where: { id },
      select: questionForAdminSelect,
    });
  },

  /**
   * Create a question with its options inside a transaction.
   */
  async createWithOptions(input: CreateQuizQuestionInput) {
    return prisma.$transaction(async (tx) => {
      const question = await tx.quiz_questions.create({
        data: {
          prompt: input.prompt,
          level: input.level,
          pattern: input.pattern,
          reference_id: input.reference_id ?? null,
          media_url: input.media_url ?? null,
        },
        select: { id: true, prompt: true, level: true, pattern: true, created_at: true },
      });

      await tx.quiz_options.createMany({
        data: input.options.map((opt) => ({
          question_id: question.id,
          label: opt.label || "",
          is_correct: opt.is_correct,
          media_url: opt.media_url ?? null,
        })),
      });

      return question;
    });
  },

  /**
   * Update a question and its options inside a transaction.
   */
  async updateWithOptions(id: string, input: CreateQuizQuestionInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Update the question fields
      const question = await tx.quiz_questions.update({
        where: { id },
        data: {
          prompt: input.prompt,
          level: input.level,
          pattern: input.pattern,
          reference_id: input.reference_id ?? null,
          media_url: input.media_url ?? null,
        },
        select: { id: true },
      });

      // 2. Simplest approach: Delete all existing options and recreate them
      // (This is fine for quiz options since they are simple and not referenced elsewhere)
      await tx.quiz_options.deleteMany({
        where: { question_id: id },
      });

      await tx.quiz_options.createMany({
        data: input.options.map((opt) => ({
          question_id: question.id,
          label: opt.label || "",
          is_correct: opt.is_correct,
          media_url: opt.media_url ?? null,
        })),
      });

      return question;
    });
  },

  /**
   * Delete a question (cascade deletes its options).
   */
  async deleteById(id: string) {
    return prisma.quiz_questions.delete({
      where: { id },
      select: { id: true },
    });
  },
};
