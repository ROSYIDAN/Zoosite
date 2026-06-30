"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NativeAnimalCard from "./native-animals/native-animal-card";
import CountryPromptCard from "./native-animals/country-prompt-card";
import NoAnimalsCard from "./native-animals/no-animals-card";
import CountrySelectorModal from "../profile/country-selector-modal";
import type { Country, NativeAnimalItem } from "@/types/native-animals.types";
import CountryFlag from "@/components/ui/country-flag";

/**
 * NativeAnimalsWidget - Main dashboard widget showing endemic animals
 * Server-fetched data, client interactivity for modal triggers
 */
export default function NativeAnimalsWidget() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [animals, setAnimals] = useState<NativeAnimalItem[]>([]);
  const [country, setCountry] = useState<Country | null>(null);
  const [allCountries, setAllCountries] = useState<Country[]>([]);

  // 1. Fetch widget data on load
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/native-animals?limit=4&sortBy=newest");
        if (res.ok) {
          const json = await res.json();
          setAnimals(json.animals || []);
          setCountry(json.country || null);
        }
      } catch (err) {
        console.error("Error loading native animals widget:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // 2. Fetch list of countries when selector modal is opened
  useEffect(() => {
    if (isModalOpen && allCountries.length === 0) {
      async function fetchCountries() {
        try {
          const res = await fetch("/api/countries?all=true");
          if (res.ok) {
            const json = await res.json();
            const formatted: Country[] = (json.data || []).map((c: any) => ({
              id: c.id,
              name: c.country,
              flag: c.country_flag,
              region: c.regions?.region || null,
            }));
            setAllCountries(formatted);
          }
        } catch (err) {
          console.error("Failed to load countries:", err);
        }
      }
      fetchCountries();
    }
  }, [isModalOpen, allCountries]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-surface-container-low border border-outline-variant/10 rounded-2xl h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // State 1: No country set - show prompt
  if (!country) {
    return (
      <section className="space-y-6">
        <CountryPromptCard onSelectCountry={() => setIsModalOpen(true)} />
        <CountrySelectorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={session?.user?.id || ""}
          countries={allCountries}
          currentCountryId={undefined}
        />
      </section>
    );
  }

  // State 2: Country set but no endemic animals
  if (animals.length === 0) {
    return (
      <section className="space-y-6">
        <NoAnimalsCard country={country} />
      </section>
    );
  }

  // State 3: Normal display with animal cards

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-primary font-headline flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl">public</span>
            <CountryFlag flag={country.flag} alt={country.name} className="text-2xl w-7 h-5" />
            Native Wildlife of {country.name}
          </h2>
          <p className="text-sm text-on-surface-variant">
            Animals native or endemic to {country.name}
          </p>
        </div>

        <a
          href="/native-animals"
          className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors"
        >
          View All
          <span className="material-symbols-outlined text-base">
            arrow_forward
          </span>
        </a>
      </div>

      {/* Animal Cards Grid */}
      <div
        className={`grid gap-6 ${
          animals.length === 1
            ? "grid-cols-1 max-w-sm mx-auto"
            : animals.length === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {animals.map((animal, idx) => (
          <NativeAnimalCard key={animal.id} animal={animal} priority={idx < 4} />
        ))}
      </div>
    </section>
  );
}
