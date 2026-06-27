"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Country } from "@/types/native-animals.types";
import CountryFlag from "@/components/ui/country-flag";

interface CountryComboboxProps {
  countries: Country[];
  value: string;
  onChange: (countryId: string) => void;
}

/**
 * CountryCombobox - Searchable country selector
 * Displays flags + country names with search filtering
 */
export default function CountryCombobox({
  countries,
  value,
  onChange,
}: CountryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!search) return countries;
    const lowerSearch = search.toLowerCase();
    return countries.filter((country) =>
      country.name.toLowerCase().includes(lowerSearch)
    );
  }, [countries, search]);

  // Find selected country
  const selectedCountry = countries.find((c) => c.id === value);

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border-2 border-outline-variant/20 bg-surface-container-low px-4 py-3 text-sm hover:border-primary/30 transition-colors",
          open && "border-primary ring-2 ring-primary/20"
        )}
      >
        <span className="flex items-center gap-2 text-on-surface">
          {selectedCountry ? (
            <>
              <CountryFlag flag={selectedCountry.flag} alt={selectedCountry.name} />
              {selectedCountry.name}
            </>
          ) : (
            <span className="text-on-surface-variant">Select country...</span>
          )}
        </span>
        <span className="material-symbols-outlined text-on-surface-variant text-xl">
          unfold_more
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-outline-variant/20 bg-surface-container-low shadow-lg">
            {/* Search Input */}
            <div className="p-3 border-b border-outline-variant/10">
              <input
                type="text"
                placeholder="Search countries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-outline-variant/20 bg-surface-container px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
            </div>

            {/* Country List */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredCountries.length === 0 ? (
                <div className="py-6 text-center text-sm text-on-surface-variant">
                  No countries found
                </div>
              ) : (
                filteredCountries.map((country) => (
                  <button
                    key={country.id}
                    type="button"
                    onClick={() => {
                      onChange(country.id);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-primary/10 transition-colors",
                      value === country.id && "bg-primary/5"
                    )}
                  >
                    <CountryFlag flag={country.flag} alt={country.name} />
                    <span className="flex-1 text-left text-on-surface">
                      {country.name}
                    </span>
                    {value === country.id && (
                      <span className="material-symbols-outlined text-primary text-base">
                        check
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}