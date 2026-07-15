"use client";

import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
import KnowledgeHelper from "./knowledge-helper";
import PredatorsInput from "./predators-input";

interface AnimalDetailStatsCardProps {
  register: UseFormRegister<CreateAnimalInput>;
  setValue: UseFormSetValue<CreateAnimalInput>;
  watch: UseFormWatch<CreateAnimalInput>;
  errors: FieldErrors<CreateAnimalInput>;
  commonName?: string;
}

const DETAIL_FIELDS: Array<{
  name:
    | "lifespan_years"
    | "weight_kg"
    | "height_cm"
    | "avg_speed_kmh"
    | "top_speed_kmh"
    | "social_structure";
  label: string;
  placeholder: string;
}> = [
  {
    name: "lifespan_years",
    label: "Lifespan (years)",
    placeholder: "e.g. 25",
  },
  {
    name: "weight_kg",
    label: "Weight (kg)",
    placeholder: "e.g. 190",
  },
  {
    name: "height_cm",
    label: "Height (cm)",
    placeholder: "e.g. 120",
  },
  {
    name: "avg_speed_kmh",
    label: "Average Speed (km/h)",
    placeholder: "e.g. 40",
  },
  {
    name: "top_speed_kmh",
    label: "Top Speed (km/h)",
    placeholder: "e.g. 65",
  },
  {
    name: "social_structure",
    label: "Social Structure",
    placeholder: "e.g. Solitary, herd-based, pair-living",
  },
];

export default function AnimalDetailStatsCard({
  register,
  setValue,
  watch,
  errors,
  commonName,
}: AnimalDetailStatsCardProps) {
  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1a1c19] font-['Plus_Jakarta_Sans'] mb-6">
        <span className="material-symbols-outlined text-[22px] text-[#805533]">monitoring</span>
        Detail Page Stats
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {DETAIL_FIELDS.map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#42493e] font-['Manrope']">
                {field.label}
              </label>
              <KnowledgeHelper label={field.label} commonName={commonName} />
            </div>
            <input
              {...register(field.name)}
              placeholder={field.placeholder}
              className="bg-[#f4f4ef] border border-[#c2c9bb] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] transition-all font-['Manrope']"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}

        <PredatorsInput
          setValue={setValue}
          watch={watch}
          errors={errors}
          commonName={commonName}
        />
      </div>
    </section>
  );
}