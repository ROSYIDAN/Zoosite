"use client";

import { useRef } from "react";
import { FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
import { usePredatorSelection } from "@/hooks/use-predator-selection";
import { useClickOutside } from "@/hooks/use-click-outside";
import KnowledgeHelper from "./knowledge-helper";

interface PredatorsInputProps {
  setValue: UseFormSetValue<CreateAnimalInput>;
  watch: UseFormWatch<CreateAnimalInput>;
  errors: FieldErrors<CreateAnimalInput>;
  commonName?: string;
}

export default function PredatorsInput({
  setValue,
  watch,
  errors,
  commonName,
}: PredatorsInputProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    predatorQuery,
    setPredatorQuery,
    animalResults,
    isLoading,
    showDropdown,
    setShowDropdown,
    currentPredators,
    addPredator,
    removePredator,
    handleKeyDown,
  } = usePredatorSelection({ setValue, watch });

  useClickOutside(dropdownRef, () => {
    setShowDropdown(false);
  });

  return (
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
  );
}