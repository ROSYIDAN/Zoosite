"use client";

import { useRef } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { Country } from "@/hooks/use-country-selection";

interface CountrySearchDropdownProps {
  countryQuery: string;
  setCountryQuery: (val: string) => void;
  showCountryDropdown: boolean;
  setShowCountryDropdown: (val: boolean) => void;
  isCountryLoading: boolean;
  countryResults: Country[];
  selectedCountryIds: string[];
  addCountry: (c: Country) => void;
  removeCountry: (id: string) => void;
  handleCountryPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  setModalCountryName: (val: string) => void;
  setIsModalOpen: (val: boolean) => void;
}

export function CountrySearchDropdown({
  countryQuery,
  setCountryQuery,
  showCountryDropdown,
  setShowCountryDropdown,
  isCountryLoading,
  countryResults,
  selectedCountryIds,
  addCountry,
  removeCountry,
  handleCountryPaste,
  setModalCountryName,
  setIsModalOpen,
}: CountrySearchDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    setShowCountryDropdown(false);
  });

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search & select countries (paste comma-separated list)..."
          value={countryQuery}
          onChange={(e) => {
            setCountryQuery(e.target.value);
            setShowCountryDropdown(true);
          }}
          onFocus={() => setShowCountryDropdown(true)}
          onPaste={handleCountryPaste}
          className="w-full pl-10 pr-4 py-2 border border-[#c2c9bb] focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/30 bg-[#fafaf5]/50 hover:bg-white rounded-lg shadow-sm outline-none transition-all placeholder:text-gray-400 font-medium"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true">
          🔍
        </div>
        {isCountryLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#2d5a27] border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Dropdown Container */}
      {showCountryDropdown && (
        <div className="absolute z-50 w-full mt-1.5 bg-white/95 backdrop-blur-sm border border-[#c2c9bb] rounded-lg shadow-lg max-h-60 overflow-y-auto divide-y divide-gray-100 focus:outline-none transition-all py-1">
          {countryResults.length > 0 ? (
            countryResults.map((c) => {
              const isSelected = selectedCountryIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      removeCountry(c.id);
                    } else {
                      addCountry(c);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm cursor-pointer transition-colors text-left outline-none ${
                    isSelected
                      ? "bg-[#2d5a27]/10 text-[#2d5a27] font-semibold"
                      : "hover:bg-[#fafaf5] text-gray-700 focus:bg-[#fafaf5]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {c.country_flag ? (
                      <span className="text-base" aria-hidden="true">
                        {c.country_flag}
                      </span>
                    ) : (
                      <span aria-hidden="true">📍</span>
                    )}
                    <span>{c.country}</span>
                  </div>
                  {isSelected && (
                    <span className="text-[#2d5a27] font-bold" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-3 text-center">
              {countryQuery.trim() === "" ? (
                <span className="text-xs text-gray-400">Type to search countries...</span>
              ) : (
                <div className="flex flex-col items-center gap-1.5 py-1">
                  <span className="text-xs text-gray-500 font-medium">
                    Country &ldquo;{countryQuery}&rdquo; not found
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setModalCountryName(countryQuery);
                      setIsModalOpen(true);
                    }}
                    className="text-xs text-[#2d5a27] hover:text-[#1e3d1a] font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Create and register &ldquo;{countryQuery}&rdquo;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}