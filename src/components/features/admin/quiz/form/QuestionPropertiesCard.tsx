"use client";

import { useFormContext, useWatch } from "react-hook-form";
import MediaPicker from "./MediaPicker";
import type { CreateQuizQuestionInput } from "@/lib/validations/quiz.schema";

export default function QuestionPropertiesCard() {
  const { register, setValue, control, formState: { errors } } = useFormContext<CreateQuizQuestionInput>();
  
  const pattern = useWatch({ name: "pattern", control });
  const mediaUrl = useWatch({ name: "media_url", control });
  const referenceId = useWatch({ name: "reference_id", control });

  const handleMediaSelect = (url: string, refId: string | null) => {
    setValue("media_url", url, { shouldValidate: true, shouldDirty: true });
    setValue("reference_id", refId || "", { shouldValidate: true, shouldDirty: true });
  };

  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-[0_4px_6px_-1px_rgba(26,28,25,0.04)]">
      <h2 className="flex items-center gap-2 text-base font-semibold text-[#1a1c19] font-['Plus_Jakarta_Sans'] pb-4 mb-4 border-b border-[#e3e3de]">
        <span className="material-symbols-outlined text-[20px] text-[#42493e]">tune</span>
        Properties
      </h2>

      {/* Format Type */}
      <div className="mb-5">
        <label
          className="block text-xs font-semibold text-[#1a1c19] font-['Manrope'] mb-2 uppercase tracking-wider"
          htmlFor="format-type"
        >
          Format Type
        </label>
        <div className="relative">
          <select
            {...register("pattern")}
            className="w-full appearance-none bg-[#fafaf5] border border-[#c2c9bb] rounded-xl px-4 py-2.5 text-sm text-[#1a1c19] font-['Manrope'] focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 focus:outline-none transition-all pr-10 cursor-pointer"
            id="format-type"
          >
            <option value="SINGLE_PICK_LIST">Single Pick (List)</option>
            <option value="MULTI_PICK_GRID">Multi Pick (Grid)</option>
            <option value="IMAGE_RECOGNITION">Image Recognition</option>
            <option value="TRUE_FALSE">True / False</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#72796e] pointer-events-none text-[20px]">
            expand_more
          </span>
        </div>
        {errors.pattern && (
          <p className="text-red-500 text-xs mt-1 font-['Manrope']">{errors.pattern.message}</p>
        )}
      </div>

      {/* Difficulty Level */}
      <div className="mb-5">
        <label
          className="block text-xs font-semibold text-[#1a1c19] font-['Manrope'] mb-2 uppercase tracking-wider"
          htmlFor="difficulty"
        >
          Difficulty Level
        </label>
        <div className="relative">
          <select
            {...register("level")}
            className="w-full appearance-none bg-[#fafaf5] border border-[#c2c9bb] rounded-xl px-4 py-2.5 text-sm text-[#1a1c19] font-['Manrope'] focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 focus:outline-none transition-all pr-10 cursor-pointer"
            id="difficulty"
          >
            <option value="EASY">Easy</option>
            <option value="NORMAL">Normal</option>
            <option value="HARD">Hard</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#72796e] pointer-events-none text-[20px]">
            expand_more
          </span>
        </div>
        {errors.level && (
          <p className="text-red-500 text-xs mt-1 font-['Manrope']">{errors.level.message}</p>
        )}
      </div>

      {/* Media Picker */}
      <div className="mt-5 pt-5 border-t border-[#e3e3de]">
        <MediaPicker
          label={pattern === "IMAGE_RECOGNITION" ? "Question Silhouette (Required)" : "Question Media (Optional)"}
          initialValue={mediaUrl || undefined}
          initialReferenceId={referenceId || undefined}
          allowUpload={pattern === "IMAGE_RECOGNITION"}
          allowSearch={pattern !== "IMAGE_RECOGNITION"}
          onSelect={handleMediaSelect}
        />
        <p className="text-xs text-[#72796e] font-['Manrope'] mt-3">
          {pattern === "IMAGE_RECOGNITION" 
            ? "Upload a silhouette or custom image to be recognized."
            : "Search the archive for an animal image to display at the top."}
        </p>
        {(errors.media_url || errors.reference_id) && (
          <p className="text-red-500 text-xs mt-2 font-['Manrope']">
            {errors.media_url?.message || errors.reference_id?.message}
          </p>
        )}
      </div>
    </section>
  );
}


