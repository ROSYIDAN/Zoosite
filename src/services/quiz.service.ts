import { AppError } from "@/lib/errors";
import { quizRepo } from "@/repositories/quiz.repo";
import type {
  CreateQuizQuestionInput,
  VerifyAnswerInput,
} from "@/lib/validations/quiz.schema";
import { QuizLevel } from "@prisma/client";

export const quizService = {
  /**
   * Get questions for a specific level (user-facing, no answers).
   */
  async getQuestionsForUser(level: QuizLevel) {
    let questions = await quizRepo.findQuestionsByLevel(level);

    if (questions.length === 0) {
      throw new AppError(`No questions available for level: ${level}`, 404, "NOT_FOUND");
    }

    // Number of questions per quiz session. 
    // TODO: You can increase this batch size later (e.g., to 5 or 10)
    const BATCH_SIZE = 3;

    if (questions.length > BATCH_SIZE) {
      // Randomize the array and take the first BATCH_SIZE elements
      questions = questions.sort(() => 0.5 - Math.random()).slice(0, BATCH_SIZE);
    }

    return questions;
  },

  /**
   * Verify a user's answer submission.
   * Returns whether correct, and the actual correct option IDs.
   */
  async verifyAnswer(input: VerifyAnswerInput) {
    const question = await quizRepo.findById(input.question_id);
    if (!question) {
      throw new AppError("Question not found", 404, "NOT_FOUND");
    }

    const correctIds = await quizRepo.findCorrectOptionIds(input.question_id);
    const selectedSet = new Set(input.selected_option_ids);
    const correctSet = new Set(correctIds);

    const isCorrect =
      selectedSet.size === correctSet.size &&
      [...selectedSet].every((id) => correctSet.has(id));

    return {
      is_correct: isCorrect,
      correct_option_ids: correctIds,
    };
  },

  /**
   * Get all questions with answers (admin-facing).
   */
  async getAllForAdmin(filters?: { level?: QuizLevel }) {
    return quizRepo.findAllForAdmin(filters);
  },

  /**
   * Get full details for a single question (admin-facing).
   */
  async getQuestionById(id: string) {
    const question = await quizRepo.findFullById(id);
    if (!question) {
      throw new AppError("Question not found", 404, "NOT_FOUND");
    }
    return question;
  },

  /**
   * Save a new question to the question bank.
   */
  async createQuestion(input: CreateQuizQuestionInput) {
    return quizRepo.createWithOptions(input);
  },

  /**
   * Update an existing question.
   */
  async updateQuestion(id: string, input: CreateQuizQuestionInput) {
    const existing = await quizRepo.findById(id);
    if (!existing) {
      throw new AppError("Question not found", 404, "NOT_FOUND");
    }

    return quizRepo.updateWithOptions(id, input);
  },

  /**
   * Delete a question by ID.
   */
  async deleteQuestion(id: string) {
    const existing = await quizRepo.findById(id);
    if (!existing) {
      throw new AppError("Question not found", 404, "NOT_FOUND");
    }

    return quizRepo.deleteById(id);
  },
};
