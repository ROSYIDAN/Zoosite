import Link from "next/link";
import { notFound } from "next/navigation";
import QuestionForm from "@/components/features/admin/quiz/question-form";
import { quizService } from "@/services/quiz.service";

interface EditQuestionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuestionPage({ params }: EditQuestionPageProps) {
  const { id } = await params;
  
  let question;
  try {
    question = await quizService.getQuestionById(id);
  } catch (error) {
    return notFound();
  }

  // Map database model to form input structure
  const initialData = {
    id: question.id,
    prompt: question.prompt,
    level: question.level as any,
    pattern: question.pattern as any,
    reference_id: question.reference_id || "",
    media_url: question.media_url || "",
    options: question.options.map((opt) => ({
      label: opt.label,
      is_correct: opt.is_correct,
      media_url: opt.media_url || "",
    })),
  };

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-bold text-[#72796e] uppercase tracking-wider">
          <Link href="/admin/quiz" className="hover:text-[#2d5a27] transition-colors">
            Question Bank
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#2d5a27]">Edit Question</span>
        </div>
        <h1 className="text-3xl font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] tracking-tight">
          Edit Question
        </h1>
        <p className="text-sm text-[#42493e] font-['Manrope']">
          Modify the question details and answers.
        </p>
      </div>

      <QuestionForm initialData={initialData} />
    </div>
  );
}
