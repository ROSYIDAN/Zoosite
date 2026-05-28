"use client";

import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
import KnowledgeHelper from "./knowledge-helper";
import TaxonomyCombobox from "./taxonomy-combobox";

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

interface AnimalIdentityCardProps {
  register: UseFormRegister<CreateAnimalInput>;
  errors: FieldErrors<CreateAnimalInput>;
  setValue: UseFormSetValue<CreateAnimalInput>;
  watch: UseFormWatch<CreateAnimalInput>;
  commonName?: string;
}

export default function AnimalIdentityCard({ register, errors, setValue, watch, commonName }: AnimalIdentityCardProps) {
  const familyValue = watch("family") || "";
  const genusValue = watch("genus") || "";
  const classId = watch("class_id") || "";
  const dietValue = watch("diet") || "";

  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1a1c19] font-['Plus_Jakarta_Sans'] mb-6">
        <span className="material-symbols-outlined text-[22px] text-secondary">fingerprint</span>
        Animal Identity
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Row 1 Left: Common Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-on-surface-variant font-['Manrope']">Common Name</label>
          <input
            {...register("name")}
            placeholder="e.g. African Elephant"
            className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all font-['Manrope']"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Row 1 Right: Scientific Name */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-on-surface-variant font-['Manrope']">Scientific Name</label>
            <KnowledgeHelper label="Scientific Name" commonName={commonName} />
          </div>
          <input
            {...register("scientific_name")}
            placeholder="e.g. Loxodonta africana"
            className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all font-['Manrope'] italic"
          />
          {errors.scientific_name && <p className="text-red-500 text-xs mt-1">{errors.scientific_name.message}</p>}
        </div>

        {/* Row 1.5: Synonyms & Nicknames */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-semibold text-on-surface-variant font-['Manrope']">Search Synonyms / Nicknames (Comma Separated)</label>
          <input
            {...register("synonyms")}
            placeholder="e.g. mountain lion, puma, catamount"
            className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all font-['Manrope']"
          />
          {errors.synonyms && <p className="text-red-500 text-xs mt-1">{errors.synonyms.message}</p>}
          <span className="text-[10px] text-on-surface-variant/50 font-['Manrope']">
            Add alternative names, search terms, or common nicknames separated by commas.
          </span>
        </div>

        {/* Row 2 Left: Diet Type (Ordo) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-on-surface-variant font-['Manrope']">Diet Type (Ordo)</label>
            <KnowledgeHelper label="Diet Type" commonName={commonName} />
          </div>
          <input
            {...register("diet")}
            list="diet-options"
            placeholder="e.g. Herbivore, Carnivore, Omnivore..."
            className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all font-['Manrope']"
          />
          <datalist id="diet-options">
            {DIETS.map(d => <option key={d} value={d} />)}
          </datalist>
          {errors.diet && <p className="text-red-500 text-xs mt-1">{errors.diet.message}</p>}
        </div>

        {/* Row 2 Right: Family */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-on-surface-variant font-['Manrope']">Family</label>
              <span className="text-[9px] font-bold tracking-wider uppercase text-emerald-500/70 font-['Manrope'] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[10px]">database</span>
                Auto
              </span>
            </div>
            <KnowledgeHelper label="Family" commonName={commonName} />
          </div>
          <TaxonomyCombobox
            field="family"
            value={familyValue}
            onChange={(val) => setValue("family", val, { shouldDirty: true, shouldValidate: true })}
            placeholder="e.g. Elephantidae"
            filters={{ class_id: classId, ordo: dietValue }}
          />
        </div>

        {/* Row 3 Left: Genus */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-on-surface-variant font-['Manrope']">Genus</label>
              <span className="text-[9px] font-bold tracking-wider uppercase text-emerald-500/70 font-['Manrope'] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[10px]">database</span>
                Auto
              </span>
            </div>
            <KnowledgeHelper label="Genus" commonName={commonName} />
          </div>
          <TaxonomyCombobox
            field="genus"
            value={genusValue}
            onChange={(val) => setValue("genus", val, { shouldDirty: true, shouldValidate: true })}
            placeholder="e.g. Loxodonta"
            filters={{ class_id: classId, family: familyValue, ordo: dietValue }}
          />
        </div>

        {/* Row 3 Right: Conservation Status */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-on-surface-variant font-['Manrope']">Conservation Status</label>
            <KnowledgeHelper label="Conservation Status" commonName={commonName} />
          </div>
          <select
            {...register("conservation_status")}
            className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all font-['Manrope']"
          >
            <option value="">Select conservation status...</option>
            {CONSERVATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.conservation_status && <p className="text-red-500 text-xs mt-1">{errors.conservation_status.message}</p>}
        </div>
      </div>
    </section>
  );
}

