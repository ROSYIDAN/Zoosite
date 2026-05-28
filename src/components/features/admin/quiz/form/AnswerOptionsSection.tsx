"use client";

import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import type { CreateQuizQuestionInput } from "@/lib/validations/quiz.schema";
import AnswerOptionRow from "./AnswerOptionRow";

export default function AnswerOptionsSection() {
  const { control, formState: { errors } } = useFormContext<CreateQuizQuestionInput>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const pattern = useWatch({ name: "pattern", control });
  const isMultiPick = pattern === "MULTI_PICK_GRID";
  const isTrueFalse = pattern === "TRUE_FALSE";

  const count = fields.length;
  const validMultiPickCounts = [3, 6, 9];
  const isValidCount = !isMultiPick || validMultiPickCounts.includes(count);
  const maxReached = isMultiPick && count >= 9;

  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-[0_4px_6px_-1px_rgba(26,28,25,0.04)]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1a1c19] font-['Plus_Jakarta_Sans']">
          <span className="material-symbols-outlined text-[22px] text-[#805533]">checklist</span>
          Answer Options
        </h2>
        <span className="text-xs font-semibold uppercase tracking-wider bg-[#eeeee9] text-[#42493e] px-3 py-1 rounded-full font-['Manrope']">
          {isMultiPick ? "Multi Pick" : isTrueFalse ? "True / False" : "Single Pick"}
        </span>
      </div>

      {isMultiPick && (
        <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-xs font-semibold font-['Manrope'] ${isValidCount ? "bg-[#bcf0ae]/20 text-[#2d5a27]" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
          <span className="material-symbols-outlined text-[16px]">{isValidCount ? "check_circle" : "info"}</span>
          <span>
            {count} option{count !== 1 ? "s" : ""} — Grid requires exactly{" "}
            {validMultiPickCounts.map((n, i) => (
              <span key={n} className={count === n ? "font-black underline" : ""}>
                {n}{i < validMultiPickCounts.length - 1 ? ", " : ""}
              </span>
            ))}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3 mb-5">
        {fields.map((field, index) => (
          <AnswerOptionRow 
            key={field.id} 
            index={index} 
            remove={remove} 
            isMultiPick={isMultiPick}
            isTrueFalse={isTrueFalse}
          />
        ))}
      </div>
      
      {errors.options && !Array.isArray(errors.options) && (
        <p className="text-red-500 text-xs mb-4 font-['Manrope']">{errors.options.message}</p>
      )}

      {!isTrueFalse && (
        <button 
          type="button"
          disabled={maxReached}
          onClick={() => append({ label: "", is_correct: false, media_url: "" })}
          className="flex items-center gap-2 text-sm font-semibold text-[#2d5a27] bg-[#bcf0ae]/30 hover:bg-[#bcf0ae]/60 px-4 py-2 rounded-xl border border-transparent hover:border-[#a1d494] transition-all font-['Manrope'] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#bcf0ae]/30"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {maxReached ? "Max 9 Options" : "Add Option"}
        </button>
      )}
    </section>
  );
}
