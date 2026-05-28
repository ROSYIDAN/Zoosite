import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { quizService } from "@/services/quiz.service";
import { quizIdParamSchema } from "@/lib/validations/quiz.schema";

/**
 * DELETE /api/admin/quiz/questions/[id]
 * Admin endpoint — delete a question from the question bank.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const parsed = quizIdParamSchema.safeParse(resolvedParams);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    await quizService.deleteQuestion(parsed.data.id);
    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/admin/quiz/questions/[id]
 * Admin endpoint — update an existing quiz question.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const result = await quizService.updateQuestion(id, body);
    return NextResponse.json({
      message: "Question updated successfully",
      data: result,
    });
  } catch (error) {
    return handleError(error);
  }
}

