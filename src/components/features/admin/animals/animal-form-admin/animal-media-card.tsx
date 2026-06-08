"use client";

import { UseFormSetValue, UseFormWatch, FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
import MediaPicker from "../../quiz/form/MediaPicker";
import KnowledgeHelper from "./knowledge-helper";

interface AnimalMediaCardProps {
  register: UseFormRegister<CreateAnimalInput>;
  setValue: UseFormSetValue<CreateAnimalInput>;
  watch: UseFormWatch<CreateAnimalInput>;
  errors: FieldErrors<CreateAnimalInput>;
  commonName?: string;
  onPreview?: () => void;
  isSafetyBlurEnabled?: boolean;
}

export default function AnimalMediaCard({ register, setValue, watch, errors, commonName, onPreview, isSafetyBlurEnabled }: AnimalMediaCardProps) {
  const imageUrl = watch("image");

  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-sm flex flex-col min-h-[480px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1a1c19] font-['Plus_Jakarta_Sans']">
          <span className="material-symbols-outlined text-[22px] text-[#805533]">image</span>
          Media Preview
        </h2>
        <KnowledgeHelper label="Photos" commonName={commonName} />
      </div>
      
      <div className="flex flex-col gap-4 flex-1">
        <MediaPicker
          initialValue={imageUrl || undefined}
          allowSearch={true}
          allowUpload={true}
          onSelect={(url: string) => setValue("image", url, { shouldDirty: true })}
          isSafetyBlurEnabled={isSafetyBlurEnabled}
        />
        {errors.image && <p className="text-red-500 text-xs">{errors.image.message}</p>}

        {imageUrl && onPreview && (
          <button
            type="button"
            onClick={onPreview}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#2d5a27]/30 bg-[#2d5a27]/5 text-[#2d5a27] text-sm font-bold font-['Manrope'] hover:bg-[#2d5a27]/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">preview</span>
            Preview & Adjust Layout
          </button>
        )}

        <div className="space-y-1.5 mt-auto">
          <div className="flex items-center justify-between px-1">
            <label className="text-[11px] font-bold text-[#1a1c19]/50 uppercase tracking-wider">
              Image Attribution / Source
            </label>
            <KnowledgeHelper label="Image Source" commonName={commonName} />
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#1a1c19]/30">
              link
            </span>
            <input
              type="text"
              {...register("image_source")}
              placeholder="e.g. Wikipedia, Unsplash, National Geographic"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] focus:ring-1 focus:ring-[#2d5a27] outline-none transition-all text-sm font-['Manrope'] bg-[#fafaf5]/50"
            />
          </div>
          {errors.image_source && (
            <p className="text-red-500 text-[11px] px-1">{errors.image_source.message}</p>
          )}

          <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={watch("image_source") === "AI Generated"}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue("image_source", "AI Generated", { shouldDirty: true });
                } else {
                  if (watch("image_source") === "AI Generated") {
                    setValue("image_source", "", { shouldDirty: true });
                  }
                }
              }}
              className="w-4 h-4 rounded border-[#c2c9bb] text-[#2d5a27] focus:ring-[#2d5a27]/30 cursor-pointer"
            />
            <span className="text-xs text-[#1a1c19]/70 font-semibold font-['Manrope']">
              This image is AI-generated
            </span>
          </label>
        </div>
      </div>
    </section>
  );
}

