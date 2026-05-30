"use client";

import MediaPicker from "./MediaPicker";
import { useFormContext } from "react-hook-form";
import type { CreateQuizQuestionInput } from "@/lib/validations/quiz.schema";

interface AnswerOptionRowProps {
  index: number;
  remove: (index: number) => void;
  isMultiPick: boolean;
  isTrueFalse?: boolean;
}

import AnimalSearchInput from "./AnimalSearchInput";

export default function AnswerOptionRow({ index, remove, isMultiPick, isTrueFalse }: AnswerOptionRowProps) {
  const { setValue, watch, formState: { errors } } = useFormContext<CreateQuizQuestionInput>();
  
  const optionsErrors = errors.options?.[index];

  const handleMediaSelect = (url: string, refId: string | null) => {
    setValue(`options.${index}.media_url`, url, { shouldValidate: true, shouldDirty: true });
  };

  const handleSelectAnimal = (animal: { name: string; imageUrl: string }) => {
    setValue(`options.${index}.label`, animal.name, { shouldValidate: true, shouldDirty: true });
    if (animal.imageUrl) {
      setValue(`options.${index}.media_url`, animal.imageUrl, { shouldValidate: true, shouldDirty: true });
    }
  };

  const isCorrectPath = `options.${index}.is_correct` as const;
  
  const handleCorrectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (!isMultiPick && checked) {
      const currentOptions = watch("options");
      currentOptions.forEach((_, i) => {
        if (i !== index) {
          setValue(`options.${i}.is_correct`, false, { shouldDirty: true });
        }
      });
    }
    setValue(isCorrectPath, checked, { shouldValidate: true, shouldDirty: true });
  };

  const isChecked = watch(isCorrectPath);
  const currentLabel = watch(`options.${index}.label`) || "";

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-[#c2c9bb] bg-[#fafaf5] focus-within:border-[#2d5a27] focus-within:ring-1 focus-within:ring-[#2d5a27]/30 transition-all group">
      <div className="pt-1.5">
        <input
          className="w-4 h-4 accent-[#2d5a27] cursor-pointer"
          type={isMultiPick ? "checkbox" : "radio"}
          checked={isChecked}
          onChange={handleCorrectChange}
        />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col">
          <AnimalSearchInput
            value={currentLabel}
            onChange={(val) => setValue(`options.${index}.label`, val, { shouldValidate: true, shouldDirty: true })}
            onSelectAnimal={handleSelectAnimal}
            placeholder={isTrueFalse ? "True / False" : "Answer Label or Search Animal..."}
          />
          {optionsErrors?.label && (
            <span className="text-red-500 text-xs mt-1 font-['Manrope']">{optionsErrors.label.message}</span>
          )}
        </div>
        
        <MediaPicker 
          compact 
          initialValue={watch(`options.${index}.media_url`) || undefined}
          allowSearch={true}
          allowUpload={false}
          onSelect={handleMediaSelect}
        />
      </div>
      {!isTrueFalse && (
        <button
          type="button"
          onClick={() => remove(index)}
          className="pt-1 text-[#72796e] hover:text-[#ba1a1a] hover:bg-[#ffdad6] p-1.5 rounded-lg transition-colors"
          title="Remove option"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      )}
    </div>
  );
}

