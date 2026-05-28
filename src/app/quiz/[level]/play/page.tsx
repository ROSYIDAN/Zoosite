import { QuizLevel } from "@prisma/client";
import { quizService } from "@/services/quiz.service";
import { mapDbToUiQuestion } from "@/lib/mappers/quiz.mapper";
import { QuizPlayClient } from "@/components/features/quiz/play/quiz-play-client";
import { notFound } from "next/navigation";

export default async function QuizPlayPage({ params }: { params: Promise<{ level: string }> }) {
  const resolvedParams = await params;
  const levelStr = resolvedParams.level.toUpperCase();

  // Validate level
  if (!["EASY", "NORMAL", "HARD"].includes(levelStr)) {
    return notFound();
  }

  const level = levelStr as QuizLevel;

  // Fetch real questions with answers (using admin fetcher since UI needs isCorrect for feedback)
  let rawQuestions = await quizService.getAllForAdmin({ level });

  // Filter out Silhouette (IMAGE_RECOGNITION) questions for now as per user request
  rawQuestions = rawQuestions.filter(q => q.pattern !== "IMAGE_RECOGNITION");

  // Number of questions per quiz session.
  // TODO: You can increase this batch size later (e.g., to 5 or 10)
  const BATCH_SIZE = 3;

  if (rawQuestions.length > BATCH_SIZE) {
    // Randomize the array and take the first BATCH_SIZE elements
    rawQuestions = rawQuestions.sort(() => 0.5 - Math.random()).slice(0, BATCH_SIZE);
  }

  if (rawQuestions.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0c0f0d] text-white p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">No Questions Found</h1>
        <p className="text-sm text-white/60 mb-6">There are no questions in the {resolvedParams.level} bank yet.</p>
        <a href="/quiz" className="bg-[#2d5a27] px-6 py-2 rounded-xl font-bold">Back to Menu</a>
      </div>
    );
  }

  // Map to UI format
  const questions = rawQuestions.map(mapDbToUiQuestion);

  return <QuizPlayClient questions={questions} level={resolvedParams.level} />;
}
