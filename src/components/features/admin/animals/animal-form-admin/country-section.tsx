"use client";

import { useEffect, useRef } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
import { useCountrySelection, Country } from "@/hooks/use-country-selection";
import KnowledgeHelper from "./knowledge-helper";
import CountryModal from "./country-modal";

interface CountrySectionProps {
  setValue: UseFormSetValue<CreateAnimalInput>;
  watch: UseFormWatch<CreateAnimalInput>;
  initialCountries?: Country[];
  commonName?: string;
}

export default function CountrySection({ setValue, watch, initialCountries, commonName }: CountrySectionProps) {
  const {
    countryQuery,
    setCountryQuery,
    countryResults,
    isCountryLoading,
    showCountryDropdown,
    setShowCountryDropdown,
    selectedCountryIds,
    selectedCountries,
    isModalOpen,
    setIsModalOpen,
    modalCountryName,
    setModalCountryName,
    addCountry,
    removeCountry,
    handleCountryPaste,
    handleRegisterSuccess,
  } = useCountrySelection({ setValue, watch, initialCountries });

  const countryRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowCountryDropdown]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1a1c19] font-['Plus_Jakarta_Sans']">
          <span className="material-symbols-outlined text-[22px] text-primary-container">public</span>
          Geographical Distribution
        </h2>
        <KnowledgeHelper label="Geographical Distribution" commonName={commonName} />
      </div>
      
      <div className="relative" ref={countryRef}>
        <div className="flex flex-col gap-3">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#1a1c19]/40 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={countryQuery}
              onChange={(e) => {
                setCountryQuery(e.target.value);
                setShowCountryDropdown(true);
              }}
              onFocus={() => setShowCountryDropdown(true)}
              onPaste={handleCountryPaste}
              placeholder="Search countries (e.g. Thailand, China...)"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#1a1c19]/10 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all text-sm font-['Manrope'] bg-[#fafaf5]/50"
            />
            {isCountryLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin w-4 h-4 border-2 border-primary-container border-t-transparent rounded-full" />
            )}
          </div>

          <p className="text-[11px] text-[#1a1c19]/50 font-['Manrope'] flex items-center gap-1.5 px-1 select-none">
            <span className="material-symbols-outlined text-[13px] text-primary-container/70">info</span>
            <span><strong>💡 Smart Paste Active:</strong> Paste a list of countries (comma or newline separated) to automatically select them.</span>
          </p>

          {/* Country Dropdown */}
          {showCountryDropdown && countryQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-outline-variant rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto overflow-x-hidden">
              {countryResults.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => addCountry(c)}
                  className="w-full text-left px-4 py-3 hover:bg-surface-container-low flex items-center gap-3 transition-colors border-b last:border-b-0 border-outline-variant/50"
                >
                  <span className="w-6 h-4 shrink-0 overflow-hidden rounded-sm bg-[#fafaf5] border border-outline-variant/30 flex items-center justify-center">
                    {c.country_flag?.startsWith("http") ? (
                      <img src={c.country_flag} alt={c.country} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[14px] leading-none">{c.country_flag || "📍"}</span>
                    )}
                  </span>
                  <span className="text-sm font-medium font-['Manrope'] text-[#1a1c19] truncate">{c.country}</span>
                  {selectedCountryIds.includes(c.id) && (
                    <span className="ml-auto material-symbols-outlined text-primary-container text-[18px]">check_circle</span>
                  )}
                </button>
              ))}

              {/* Inline Register Country Option */}
              <button
                type="button"
                onClick={() => {
                  setModalCountryName(countryQuery);
                  setIsModalOpen(true);
                  setShowCountryDropdown(false);
                }}
                className="w-full text-left px-4 py-3 bg-primary-container/5 hover:bg-primary-container/10 flex items-center gap-3 transition-colors text-primary-container font-bold font-['Manrope'] text-xs border-t border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Can't find it? Register "{countryQuery}" as a new country</span>
              </button>
            </div>
          )}

          {/* Selected Countries */}
          <div className="flex flex-wrap gap-2">
            {selectedCountries.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-outline-variant text-[#1a1c19] text-xs font-bold font-['Manrope'] hover:border-primary-container transition-all group"
              >
                <span className="w-4 h-3 shrink-0 overflow-hidden rounded-[2px] bg-[#fafaf5] border border-outline-variant/30 flex items-center justify-center">
                  {c.country_flag?.startsWith("http") ? (
                    <img src={c.country_flag} alt={c.country} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] leading-none">{c.country_flag || "📍"}</span>
                  )}
                </span>
                {c.country}
                <button
                  type="button"
                  onClick={() => removeCountry(c.id)}
                  className="text-[#1a1c19]/40 hover:text-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <CountryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialCountryName={modalCountryName}
        onRegisterSuccess={handleRegisterSuccess}
      />
    </div>
  );
}
