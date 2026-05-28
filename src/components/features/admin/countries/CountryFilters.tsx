"use client";

import { Region } from "./types";

interface CountryFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedRegionId: string;
  setSelectedRegionId: (id: string) => void;
  regions: Region[];
}

export default function CountryFilters({
  searchQuery,
  setSearchQuery,
  selectedRegionId,
  setSelectedRegionId,
  regions,
}: CountryFiltersProps) {
  return (
    <section className="flex flex-col sm:flex-row gap-4 items-center bg-[#fafaf5] border border-outline-variant/40 rounded-2xl p-4">
      <div className="relative flex-1 w-full">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#1a1c19]/40 text-[20px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search countries by name..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant/60 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all text-sm font-['Manrope'] bg-white"
        />
      </div>

      <div className="relative w-full sm:w-64">
        <select
          value={selectedRegionId}
          onChange={(e) => setSelectedRegionId(e.target.value)}
          className="w-full pl-4 pr-10 py-3 rounded-xl border border-outline-variant/60 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all text-sm font-['Manrope'] bg-white appearance-none cursor-pointer"
        >
          <option value="">All Regions / Continents</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.region}
            </option>
          ))}
        </select>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#1a1c19]/40 pointer-events-none text-[20px]">
          unfold_more
        </span>
      </div>
    </section>
  );
}
