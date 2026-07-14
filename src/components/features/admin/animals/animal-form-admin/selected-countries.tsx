"use client";

import { Country } from "@/hooks/use-country-selection";

interface SelectedCountriesProps {
  selectedCountries: Country[];
  removeCountry: (id: string) => void;
}

export function SelectedCountries({ selectedCountries, removeCountry }: SelectedCountriesProps) {
  if (selectedCountries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-white border border-[#c2c9bb] rounded-lg shadow-sm">
      {selectedCountries.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => removeCountry(c.id)}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#f4f6f0] hover:bg-red-50 text-[#3c5e2d] hover:text-red-700 rounded-full border border-[#c2c9bb]/60 cursor-pointer transition-all group font-medium text-sm outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
          title={`Click to remove ${c.country}`}
        >
          {c.country_flag ? (
            <span className="text-base leading-none" aria-hidden="true">
              {c.country_flag}
            </span>
          ) : (
            <span className="text-[#3c5e2d] group-hover:text-red-700" aria-hidden="true">
              📍
            </span>
          )}
          <span>{c.country}</span>
          <span className="text-xs text-gray-400 group-hover:text-red-500 font-bold ml-0.5" aria-hidden="true">
            ×
          </span>
        </button>
      ))}
    </div>
  );
}