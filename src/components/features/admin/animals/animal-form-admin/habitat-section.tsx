"use client";

import { useEffect, useRef } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
import { useHabitatSelection } from "@/hooks/use-habitat-selection";

interface HabitatSectionProps {
  setValue: UseFormSetValue<CreateAnimalInput>;
  watch: UseFormWatch<CreateAnimalInput>;
}

export default function HabitatSection({ setValue, watch }: HabitatSectionProps) {
  const {
    habitatQuery,
    setHabitatQuery,
    habitatResults,
    showHabitatDropdown,
    setShowHabitatDropdown,
    selectedHabitats,
    addHabitat,
    removeHabitat,
    handleHabitatKeyDown,
    handleHabitatPaste,
  } = useHabitatSelection({ setValue, watch });

  const habitatRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (habitatRef.current && !habitatRef.current.contains(event.target as Node)) {
        setShowHabitatDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowHabitatDropdown]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1a1c19] font-['Plus_Jakarta_Sans']">
        <span className="material-symbols-outlined text-[22px] text-primary-container">forest</span>
        Habitats & Environment
      </h2>
      
      <div className="relative" ref={habitatRef}>
        <div className="flex flex-col gap-3">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#1a1c19]/40 text-[20px]">
              add_circle
            </span>
            <input
              type="text"
              value={habitatQuery}
              onChange={(e) => {
                setHabitatQuery(e.target.value);
                setShowHabitatDropdown(true);
              }}
              onFocus={() => setShowHabitatDropdown(true)}
              onKeyDown={handleHabitatKeyDown}
              onPaste={handleHabitatPaste}
              placeholder="Type and press Enter to add habitat (e.g. Tundra)"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#1a1c19]/10 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all text-sm font-['Manrope'] bg-[#fafaf5]/50"
            />
          </div>

          <p className="text-[11px] text-[#1a1c19]/50 font-['Manrope'] flex items-center gap-1.5 px-1 select-none">
            <span className="material-symbols-outlined text-[13px] text-primary-container/70">info</span>
            <span><strong>💡 Smart Paste Active:</strong> Paste a list of habitats (comma or newline separated) to automatically select existing ones.</span>
          </p>

          {/* Habitat Dropdown (Results from DB) */}
          {showHabitatDropdown && habitatResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-outline-variant rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto">
              {habitatResults.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => addHabitat(h.habitat_name)}
                  className="w-full text-left px-4 py-3 hover:bg-surface-container-low flex items-center gap-3 transition-colors border-b last:border-b-0 border-outline-variant/50"
                >
                  <span className="material-symbols-outlined text-primary-container/40 text-[18px]">history</span>
                  <span className="text-sm font-medium font-['Manrope'] text-[#1a1c19]">{h.habitat_name}</span>
                  {selectedHabitats.includes(h.habitat_name) && (
                    <span className="ml-auto material-symbols-outlined text-primary-container text-[18px]">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Selected Habitats */}
          <div className="flex flex-wrap gap-2">
            {selectedHabitats.map((h) => (
              <span
                key={h}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-container/5 border border-primary-container/20 text-primary-container text-xs font-bold font-['Manrope']"
              >
                {h}
                <button
                  type="button"
                  onClick={() => removeHabitat(h)}
                  className="hover:text-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
