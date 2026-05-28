"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
import KnowledgeHelper from "./knowledge-helper";

interface AnimalDescriptionCardProps {
  register: UseFormRegister<CreateAnimalInput>;
  errors: FieldErrors<CreateAnimalInput>;
  commonName?: string;
}

export default function AnimalDescriptionCard({ register, errors, commonName }: AnimalDescriptionCardProps) {
  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1a1c19] font-['Plus_Jakarta_Sans']">
          <span className="material-symbols-outlined text-[22px] text-[#805533]">description</span>
          Detailed Summary
        </h2>
        <KnowledgeHelper label="Description" commonName={commonName} />
      </div>
      <div className="flex flex-col gap-1.5">
        <textarea
          {...register("description")}
          rows={6}
          placeholder="Provide a detailed description of the animal..."
          className="bg-[#f4f4ef] border border-[#c2c9bb] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] transition-all font-['Manrope'] resize-none"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5 mt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[#42493e] font-['Manrope']">
            Source URL <span className="text-[#72796d]">(optional)</span>
          </label>
          <KnowledgeHelper label="Description Source" commonName={commonName} />
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#72796d]">link</span>
          <input
            {...register("description_source")}
            type="url"
            placeholder="e.g. https://www.oregonzoo.org/discover/animals/red-panda"
            className="flex-1 bg-[#f4f4ef] border border-[#c2c9bb] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] transition-all font-['Manrope']"
          />
        </div>
        {errors.description_source && (
          <p className="text-red-500 text-xs mt-1">{errors.description_source.message}</p>
        )}
      </div>
    </section>
  );
}
