"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { Country, NativeAnimalItem } from "@/types/native-animals.types";

// ── helpers ──

/** Check if a JSON-array-or-string field includes the given value. */
function matchesJsonField(raw: string | null | undefined, value: string): boolean {
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.includes(value);
  } catch {
    return raw === value;
  }
}

// ── hook ──

export function useNativeAnimalsPage() {
  const { data: session, update: updateSession } = useSession();

  // ── state ──
  const [countries, setCountries] = useState<Country[]>([]);
  const [animals, setAnimals] = useState<NativeAnimalItem[]>([]);
  const [currentCountryId, setCurrentCountryId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "NATIVE" | "ENDEMIC">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimalsLoading, setIsAnimalsLoading] = useState(false);
  const [locationOptions, setLocationOptions] = useState<{
    regions: string[];
    provinces: string[];
    localities: string[];
  }>({ regions: [], provinces: [], localities: [] });

  // ── 1. Fetch all countries on mount ──
  useEffect(() => {
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
          setCountries(formatted);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCountries();
  }, []);

  // ── 2. Set currentCountryId from session ──
  useEffect(() => {
    if (session?.user?.countryId) {
      if (currentCountryId !== session.user.countryId) setCurrentCountryId(session.user.countryId);
    } else if (countries.length > 0 && !currentCountryId) {
      const defaultCountry = countries.find((c) => c.name.toLowerCase() === "thailand") || countries[0];
      if (defaultCountry) setCurrentCountryId(defaultCountry.id);
    }
  }, [session?.user?.countryId, countries, currentCountryId]);

  // ── 3. Fetch location filter options when country changes ──
  useEffect(() => {
    if (!currentCountryId) return;
    async function fetchLocationOptions() {
      try {
        const res = await fetch(`/api/native-animals/locations?countryId=${currentCountryId}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          setLocationOptions({
            regions: json.regions || [],
            provinces: json.provinces || [],
            localities: json.localities || [],
          });
        }
      } catch (err) {
        console.error("Error fetching location options:", err);
      }
    }
    fetchLocationOptions();
  }, [currentCountryId]);

  // ── 4. Fetch animals when country changes ──
  useEffect(() => {
    if (!currentCountryId) return;
    async function fetchAnimals() {
      setIsAnimalsLoading(true);
      try {
        const res = await fetch(`/api/native-animals?countryId=${currentCountryId}&status=ALL&limit=1000`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          setAnimals(json.animals || []);
        }
      } catch (err) {
        console.error("Error fetching native animals:", err);
      } finally {
        setIsAnimalsLoading(false);
      }
    }
    fetchAnimals();
  }, [currentCountryId]);

  // ── derived data ──

  const currentCountry = useMemo(
    () => countries.find((c) => c.id === currentCountryId) || null,
    [countries, currentCountryId]
  );

  const families = useMemo(() => {
    const unique = new Set(animals.map((a) => a.family).filter((f): f is string => Boolean(f)));
    return Array.from(unique).sort();
  }, [animals]);

  const filteredAnimals = useMemo(() => {
    let filtered = [...animals];

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.scientific_name?.toLowerCase().includes(q) ||
          a.family?.toLowerCase().includes(q)
      );
    }
    if (selectedFamily) {
      filtered = filtered.filter((a) => a.family === selectedFamily);
    }
    if (selectedRegion) {
      filtered = filtered.filter((a) => matchesJsonField(a.region_name, selectedRegion));
    }
    if (selectedProvince) {
      filtered = filtered.filter((a) => matchesJsonField(a.province, selectedProvince));
    }
    if (selectedLocality) {
      filtered = filtered.filter((a) => matchesJsonField(a.locality, selectedLocality));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "recent":
        default:
          return 0;
      }
    });

    return filtered;
  }, [animals, statusFilter, searchQuery, selectedFamily, selectedRegion, selectedProvince, selectedLocality, sortBy]);

  // ── handlers ──

  const handleCountryChange = useCallback(
    async (countryId: string) => {
      setCurrentCountryId(countryId);
      try {
        const response = await fetch("/api/user/country", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ countryId }),
        });
        if (response.ok) await updateSession({ countryId });
      } catch (err) {
        console.error("Failed to update user country preference:", err);
      }
    },
    [updateSession]
  );

  return {
    // data
    countries,
    currentCountry,
    families,
    filteredAnimals,
    locationOptions,
    // loading
    isLoading,
    isAnimalsLoading,
    // filter state + setters
    searchQuery,
    setSearchQuery,
    selectedFamily,
    setSelectedFamily,
    selectedRegion,
    setSelectedRegion,
    selectedProvince,
    setSelectedProvince,
    selectedLocality,
    setSelectedLocality,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    // handlers
    handleCountryChange,
  };
}