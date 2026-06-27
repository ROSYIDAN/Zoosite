"use client";

import { useState } from "react";
import type { Country } from "@/types/native-animals.types";
import CountryFlag from "@/components/ui/country-flag";

interface PageHeaderProps {
  currentCountry: Country;
  animalCount: number;
  allCountries: Country[];
  onCountryChange: (countryId: string) => void;
}

/**
 * PageHeader - Header for native animals page
 * Shows country, animal count, country selector, and educational content
 */
export default function PageHeader({
  currentCountry,
  animalCount,
  allCountries,
  onCountryChange,
}: PageHeaderProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [showCountrySelector, setShowCountrySelector] = useState(false);



  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary font-headline flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl">public</span>
            <CountryFlag flag={currentCountry.flag} alt={currentCountry.name} className="text-3xl w-8 h-5" />
            Endemic Wildlife of {currentCountry.name}
          </h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Discover {animalCount} species found only in {currentCountry.name}
          </p>
        </div>

        {/* Country Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCountrySelector(!showCountrySelector)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant/20 rounded-xl hover:border-primary/30 transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-xl">
              swap_horiz
            </span>
            <span className="text-sm font-medium text-on-surface">
              Browse Other Countries
            </span>
          </button>

          {/* Dropdown Menu */}
          {showCountrySelector && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowCountrySelector(false)}
              />
              <div className="absolute right-0 mt-2 w-64 max-h-96 overflow-y-auto bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-xl z-50">
                <div className="p-2">
                  {allCountries.map((country) => (
                    <button
                      key={country.id}
                      onClick={() => {
                        onCountryChange(country.id);
                        setShowCountrySelector(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors flex items-center gap-2 ${
                        country.id === currentCountry.id ? "bg-primary/5" : ""
                      }`}
                    >
                      <CountryFlag flag={country.flag} alt={country.name} />
                      <span className="text-sm text-on-surface flex-1">
                        {country.name}
                      </span>
                      {country.id === currentCountry.id && (
                        <span className="material-symbols-outlined text-primary text-base">
                          check
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Educational Content Panel */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-primary/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">
              school
            </span>
            <span className="font-semibold text-primary font-headline">
              What are Endemic Species?
            </span>
          </div>
          <span
            className={`material-symbols-outlined text-primary transition-transform ${
              showInfo ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </button>

        {showInfo && (
          <div className="px-6 pb-6 space-y-4 text-sm text-on-surface">
            <p>
              <strong className="text-primary">Endemic species</strong> are
              plants or animals that exist naturally in only one geographic
              region and nowhere else on Earth. They are unique to that specific
              location.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-xl p-4 border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-xl">
                    location_on
                  </span>
                  <strong className="text-primary">Geographically Limited</strong>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Found in only one country, island, or region - making them
                  irreplaceable
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-xl">
                    warning
                  </span>
                  <strong className="text-primary">Vulnerable</strong>
                </div>
                <p className="text-xs text-on-surface-variant">
                  More susceptible to extinction since their entire population
                  exists in one place
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-xl">
                    favorite
                  </span>
                  <strong className="text-primary">Conservation Priority</strong>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Protecting endemic species is crucial for preserving global
                  biodiversity
                </p>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant italic mt-4">
              Example: The Komodo dragon is endemic to Indonesia - it naturally
              exists only on a few Indonesian islands and nowhere else in the
              wild.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}