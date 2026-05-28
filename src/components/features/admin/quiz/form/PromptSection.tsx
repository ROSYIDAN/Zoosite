import { useFormContext } from "react-hook-form";
import type { CreateQuizQuestionInput } from "@/lib/validations/quiz.schema";

export default function PromptSection() {
  const { register, formState: { errors } } = useFormContext<CreateQuizQuestionInput>();

  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-[0_4px_6px_-1px_rgba(26,28,25,0.04)]">
      <label
        className="flex items-center gap-2 text-sm font-semibold text-[#1a1c19] font-['Manrope'] mb-3"
        htmlFor="question-prompt"
      >
        <span className="material-symbols-outlined text-[20px] text-[#2d5a27]">edit_document</span>
        Question Prompt
      </label>
      <textarea
        {...register("prompt")}
        className="w-full bg-[#fafaf5] border border-[#c2c9bb] rounded-xl px-4 py-3 text-sm text-[#1a1c19] font-['Manrope'] placeholder:text-[#72796e] focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 focus:outline-none transition-all resize-y"
        id="question-prompt"
        placeholder="Enter the main question text or scenario here..."
        rows={5}
      />
      {errors.prompt && (
        <p className="text-red-500 text-xs mt-2 font-['Manrope']">{errors.prompt.message}</p>
      )}
    </section>
  );
}
