import Link from "next/link";
import QuestionForm from "@/components/features/admin/quiz/question-form";

export default function CreateQuizQuestionPage() {
  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] tracking-tight">
            Create New Question
          </h1>
          <p className="text-sm text-[#42493e] mt-1 font-['Manrope']">
            Draft and configure a new quiz item for the question bank.
          </p>
        </div>
        <Link
          href="/admin/quiz"
          className="flex items-center gap-2 text-sm font-medium text-[#42493e] hover:text-[#1a1c19] font-['Manrope'] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Bank
        </Link>
      </div>

      <QuestionForm />
    </div>
  );
}
