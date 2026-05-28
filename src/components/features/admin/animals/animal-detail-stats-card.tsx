"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
import KnowledgeHelper from "./knowledge-helper";

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
  const [predatorQuery, setPredatorQuery] = useState("");
  const [animalResults, setAnimalResults] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const predatorsValue = watch("predators") || "";
  const currentPredators = predatorsValue
    ? predatorsValue.split(",").map((p) => p.trim()).filter(Boolean)
    : [];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search existing animals in database
  useEffect(() => {
    if (predatorQuery.trim().length < 1) {
      setAnimalResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/animals?search=${encodeURIComponent(predatorQuery)}`);
        const data = await res.json();
        setAnimalResults(data.data || []);
      } catch (err) {
        console.error("Failed to search animals for predators:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [predatorQuery]);

  const addPredator = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    // Capitalize words beautifully (Title Case)
    const normalized = trimmed
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (!currentPredators.includes(normalized)) {
      const updated = [...currentPredators, normalized];
      setValue("predators", updated.join(", "), { shouldDirty: true });
    }
    setPredatorQuery("");
    setShowDropdown(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addPredator(predatorQuery);
    }
  };

  const removePredator = (name: string) => {
    const updated = currentPredators.filter((p) => p !== name);
    setValue("predators", updated.join(", "), { shouldDirty: true });
  };

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

        {/* Predators field with search auto-select & free-text input */}
        <div className="flex flex-col gap-1.5 md:col-span-2 relative" ref={dropdownRef}>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#42493e] font-['Manrope']">
              Predators
            </label>
            <KnowledgeHelper label="Predators" commonName={commonName} />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#1a1c19]/40 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={predatorQuery}
              onChange={(e) => {
                setPredatorQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search animals (e.g. Lion), or type custom and press Enter"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] focus:ring-1 focus:ring-[#2d5a27] outline-none transition-all text-sm font-['Manrope'] bg-[#fafaf5]/50"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin w-4 h-4 border-2 border-[#2d5a27] border-t-transparent rounded-full" />
            )}
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {showDropdown && predatorQuery.trim().length > 0 && (
            <div className="absolute top-[calc(100%-8px)] left-0 right-0 mt-2 bg-white border border-[#c2c9bb] rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
              {animalResults.length > 0 && (
                animalResults
                  .filter((animal) => !currentPredators.includes(animal.name))
                  .map((animal) => (
                    <button
                      key={animal.id}
                      type="button"
                      onClick={() => addPredator(animal.name)}
                      className="w-full text-left px-4 py-3 hover:bg-[#fafaf5] flex items-center gap-3 transition-colors border-b last:border-b-0 border-[#c2c9bb]/35 font-['Manrope']"
                    >
                      <span className="material-symbols-outlined text-[#2d5a27] text-[18px]">pets</span>
                      <span className="text-sm font-medium text-[#1a1c19]">{animal.name}</span>
                    </button>
                  ))
              )}

              {/* Add Custom Free-Text Option */}
              <button
                type="button"
                onClick={() => addPredator(predatorQuery)}
                className="w-full text-left px-4 py-3 bg-[#2d5a27]/5 hover:bg-[#2d5a27]/10 flex items-center gap-3 transition-colors text-[#2d5a27] font-bold font-['Manrope'] text-xs border-t border-[#c2c9bb]/35"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Can't find it? Add "{predatorQuery}" as custom predator</span>
              </button>
            </div>
          )}

          {/* Selected Predators Pills */}
          {currentPredators.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {currentPredators.map((predator) => (
                <span
                  key={predator}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2d5a27]/10 text-[#2d5a27] text-xs font-bold font-['Manrope'] border border-[#2d5a27]/20"
                >
                  {predator}
                  <button
                    type="button"
                    onClick={() => removePredator(predator)}
                    className="hover:text-red-500 transition-colors focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              ))}
            </div>
          )}

          {errors.predators && (
            <p className="text-red-500 text-xs mt-1">{errors.predators.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
