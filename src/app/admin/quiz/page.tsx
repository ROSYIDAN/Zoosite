import Link from "next/link";
import QuestionTable from "@/components/features/admin/quiz/question-table";
import { quizService } from "@/services/quiz.service";

// ── Page ──────────────────────────────────────────────────────────────────

export default async function AdminQuizQuestionsPage() {
  const rawQuestions = await quizService.getAllForAdmin();

  // Map database results to the shape expected by the UI component
  const questions = rawQuestions.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    level: q.level as any, // Cast to match UI types
    pattern: q.pattern as any,
    optionsCount: q.options.length,
    createdAt: q.created_at,
  }));

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] tracking-tight">
            Question Bank
          </h1>
          <p className="text-sm text-[#42493e] mt-1 font-['Manrope']">
            Manage and organize the quiz content library.
          </p>
        </div>
        <Link
          href="/admin/quiz/create"
          className="flex items-center gap-2 bg-[#2d5a27] hover:bg-[#154212] text-white text-sm font-semibold font-['Manrope'] px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create New Question
        </Link>
      </div>

      <QuestionTable questions={questions} />
    </div>
  );
}
