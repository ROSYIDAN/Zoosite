import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { quizService } from "@/services/quiz.service";
import { listQuizQuestionsQuerySchema } from "@/lib/validations/quiz.schema";

/**
 * GET /api/quiz/questions?level=EASY
 * Public endpoint — returns questions WITHOUT correct answers.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const parsed = listQuizQuestionsQuerySchema.safeParse({
      level: searchParams.get("level") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = await quizService.getQuestionsForUser(parsed.data.level);
    return NextResponse.json({ data });
  } catch (error) {
    return handleError(error);
  }
}
