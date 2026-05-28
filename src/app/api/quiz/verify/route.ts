import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { quizService } from "@/services/quiz.service";
import { verifyAnswerSchema } from "@/lib/validations/quiz.schema";

/**
 * POST /api/quiz/verify
 * Public endpoint — checks user's selected options against the correct answers.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = verifyAnswerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await quizService.verifyAnswer(parsed.data);
    return NextResponse.json({ data: result });
  } catch (error) {
    return handleError(error);
  }
}
