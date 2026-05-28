"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
import KnowledgeHelper from "./knowledge-helper";

interface AnimalClassificationCardProps {
  register: UseFormRegister<CreateAnimalInput>;
  errors: FieldErrors<CreateAnimalInput>;
  classes: { id: string; name: string }[];
  commonName?: string;
}

export default function AnimalClassificationCard({ register, errors, classes, commonName }: AnimalClassificationCardProps) {
  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1a1c19] font-['Plus_Jakarta_Sans'] mb-6">
        <span className="material-symbols-outlined text-[22px] text-[#805533]">category</span>
        Classification
      </h2>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-[#42493e] font-['Manrope']">Animal Class</label>
          <KnowledgeHelper label="Animal Class" commonName={commonName} />
        </div>
        <select
          {...register("class_id")}
          className="bg-[#f4f4ef] border border-[#c2c9bb] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] transition-all font-['Manrope']"
        >
          <option value="">Select a class...</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {errors.class_id && <p className="text-red-500 text-xs mt-1">{errors.class_id.message}</p>}
      </div>
    </section>
  );
}
