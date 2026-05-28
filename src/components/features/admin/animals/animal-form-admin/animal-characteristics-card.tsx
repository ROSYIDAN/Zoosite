"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
import KnowledgeHelper from "./knowledge-helper";

interface AnimalCharacteristicsCardProps {
  register: UseFormRegister<CreateAnimalInput>;
  errors: FieldErrors<CreateAnimalInput>;
  commonName?: string;
}

const CONSERVATION_STATUSES = [
  "Least Concern",
  "Near Threatened",
  "Vulnerable",
  "Endangered",
  "Critically Endangered",
  "Extinct in the Wild",
  "Extinct",
  "Data Deficient"
];

const DIETS = ["Herbivore", "Carnivore", "Omnivore"];

export default function AnimalCharacteristicsCard({ register, errors, commonName }: AnimalCharacteristicsCardProps) {
  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1a1c19] font-['Plus_Jakarta_Sans'] mb-6">
        <span className="material-symbols-outlined text-[22px] text-[#805533]">analytics</span>
        Key Characteristics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#42493e] font-['Manrope']">Diet Type</label>
            <KnowledgeHelper label="Diet Type" commonName={commonName} />
          </div>
          <input
            {...register("diet")}
            list="diet-options"
            placeholder="e.g. Herbivore, Insectivore..."
            className="bg-[#f4f4ef] border border-[#c2c9bb] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] transition-all font-['Manrope']"
          />
          <datalist id="diet-options">
            {DIETS.map(d => <option key={d} value={d} />)}
          </datalist>
          {errors.diet && <p className="text-red-500 text-xs mt-1">{errors.diet.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#42493e] font-['Manrope']">Conservation Status</label>
            <KnowledgeHelper label="Conservation Status" commonName={commonName} />
          </div>
          <select
            {...register("conservation_status")}
            className="bg-[#f4f4ef] border border-[#c2c9bb] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] transition-all font-['Manrope']"
          >
            {CONSERVATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.conservation_status && <p className="text-red-500 text-xs mt-1">{errors.conservation_status.message}</p>}
        </div>
      </div>
    </section>
  );
}
