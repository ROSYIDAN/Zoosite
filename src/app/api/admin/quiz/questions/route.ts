import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { quizService } from "@/services/quiz.service";
import { createQuizQuestionSchema } from "@/lib/validations/quiz.schema";
import { QuizLevel } from "@prisma/client";

/**
 * GET /api/admin/quiz/questions
 * Admin endpoint — returns all questions WITH correct answers.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const levelParam = searchParams.get("level");

    const filters: { level?: QuizLevel } = {};
    if (levelParam && Object.values(QuizLevel).includes(levelParam as QuizLevel)) {
      filters.level = levelParam as QuizLevel;
    }

    const data = await quizService.getAllForAdmin(filters);
    return NextResponse.json({ data });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/admin/quiz/questions
 * Admin endpoint — create a new question in the question bank.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = createQuizQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await quizService.createQuestion(parsed.data);
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
