"use client";

import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

interface QuestionActionsCardProps {
  onPreview: () => void;
}

export default function QuestionActionsCard({ onPreview }: QuestionActionsCardProps) {
  const { formState: { isSubmitting, isDirty }, watch } = useFormContext();
  const id = watch("id");
  const isEditing = !!id;

  const isUpdateDisabled = isEditing && !isDirty;
  const isSubmitDisabled = isSubmitting || isUpdateDisabled;

  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(26,28,25,0.04)] flex flex-col gap-3">
      <button
        type="button"
        onClick={onPreview}
        className="w-full flex items-center justify-center gap-2 bg-[#fafaf5] border border-[#2d5a27] text-[#2d5a27] text-sm font-semibold font-['Manrope'] px-5 py-3 rounded-xl hover:bg-[#2d5a27]/5 transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined text-[18px]">visibility</span>
        Preview & Layout
      </button>

      <div className="h-px w-full bg-[#e3e3de] my-1" />

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className={cn(
          "w-full flex items-center justify-center gap-2 text-white text-sm font-semibold font-['Manrope'] px-5 py-3 rounded-xl transition-all shadow-sm active:scale-[0.98] disabled:active:scale-100 disabled:cursor-not-allowed",
          isEditing
            ? "bg-[#e49e2a] hover:bg-[#c6861d] disabled:bg-[#e49e2a]/60"
            : "bg-[#2d5a27] hover:bg-[#154212] disabled:bg-[#2d5a27]/60"
        )}
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <span className="material-symbols-outlined text-[18px]">
            {isEditing ? "edit" : "save"}
          </span>
        )}
        {isSubmitting
          ? (isEditing ? "Updating..." : "Saving...")
          : isEditing
            ? isUpdateDisabled ? "No Changes to Update" : "Update Question"
            : "Save Question"}
      </button>
      <Link
        href="/admin/quiz"
        className="w-full flex items-center justify-center gap-2 bg-transparent text-[#42493e] border border-[#c2c9bb] text-sm font-semibold font-['Manrope'] px-5 py-3 rounded-xl hover:bg-[#eeeee9] transition-colors"
      >
        Cancel
      </Link>
    </section>
  );
}
