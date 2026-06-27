"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";
import PageHeader from "@/components/features/native-animals/page-header";
import FilterBar from "@/components/features/native-animals/filter-bar";
import AnimalGrid from "@/components/features/native-animals/animal-grid";
import type { Country, NativeAnimalItem } from "@/types/native-animals.types";

/**
 * Native Animals Page - Full page showing all native and endemic animals
 * Integrates with database and session for user country preferences
 */
export default function NativeAnimalsPage() {
  const { data: session, update: updateSession } = useSession();

  const [countries, setCountries] = useState<Country[]>([]);
  const [animals, setAnimals] = useState<NativeAnimalItem[]>([]);
  const [currentCountryId, setCurrentCountryId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "NATIVE" | "ENDEMIC">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimalsLoading, setIsAnimalsLoading] = useState(false);

  // 1. Fetch all countries on load
  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch("/api/countries?all=true");
        if (res.ok) {
          const json = await res.json();
          // API returns { data: [ { id, country, country_flag, regions } ] }
          const formattedCountries: Country[] = (json.data || []).map((c: any) => ({
            id: c.id,
            name: c.country,
            flag: c.country_flag,
            region: c.regions?.region || null,
          }));
          setCountries(formattedCountries);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCountries();
  }, []);

  // 2. Set currentCountryId from session when session loads
  useEffect(() => {
    if (session?.user?.countryId) {
      setCurrentCountryId(session.user.countryId);
    } else if (countries.length > 0 && !currentCountryId) {
      // Default to Thailand or first country if no country is in session
      const defaultCountry = countries.find(c => c.name.toLowerCase() === "thailand") || countries[0];
      if (defaultCountry) {
        setCurrentCountryId(defaultCountry.id);
      }
    }
  }, [session, countries, currentCountryId]);

  // 3. Fetch animals when selected country changes
  useEffect(() => {
    if (!currentCountryId) return;

    async function fetchAnimals() {
      setIsAnimalsLoading(true);
      try {
        const res = await fetch(`/api/native-animals?countryId=${currentCountryId}&status=ALL`);
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

  const currentCountry = useMemo(() => {
    return countries.find((c) => c.id === currentCountryId) || null;
  }, [countries, currentCountryId]);

  // Extract unique families from fetched animals for filter dropdown
  const families = useMemo(() => {
    const uniqueFamilies = new Set(
      animals.map((a) => a.family).filter((f): f is string => Boolean(f))
    );
    return Array.from(uniqueFamilies).sort();
  }, [animals]);

  // Filter and sort animals on client side for instantaneous feel
  const filteredAnimals = useMemo(() => {
    let filtered = [...animals];

    // Status filter (ALL, NATIVE, ENDEMIC)
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((animal) => animal.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (animal) =>
          animal.name.toLowerCase().includes(query) ||
          animal.scientific_name?.toLowerCase().includes(query) ||
          animal.family?.toLowerCase().includes(query)
      );
    }

    // Family filter
    if (selectedFamily) {
      filtered = filtered.filter((animal) => animal.family === selectedFamily);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "recent":
        default:
          return 0; // In real DB order is already from API, we can leave unmodified
      }
    });

    return filtered;
  }, [animals, statusFilter, searchQuery, selectedFamily, sortBy]);

  // Handle changing user country preference
  const handleCountryChange = async (countryId: string) => {
    setCurrentCountryId(countryId);

    // Call API to save preference in database
    try {
      const response = await fetch("/api/user/country", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryId }),
      });

      if (response.ok) {
        // Update local session info
        await updateSession({ countryId });
      }
    } catch (err) {
      console.error("Failed to update user country preference:", err);
    }
  };

  if (isLoading || !currentCountry) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1440px] mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <a
            href="/dashboard"
            className="hover:text-primary transition-colors"
          >
            Dashboard
          </a>
          <span className="material-symbols-outlined text-base">
            chevron_right
          </span>
          <span className="text-primary font-medium">Native & Endemic Wildlife</span>
        </div>

        <PageHeader
          currentCountry={currentCountry}
          animalCount={filteredAnimals.length}
          allCountries={countries}
          onCountryChange={handleCountryChange}
        />

        <FilterBar
          onSearchChange={setSearchQuery}
          onFamilyChange={setSelectedFamily}
          onSortChange={setSortBy}
          onStatusChange={setStatusFilter}
          families={families}
          currentSearch={searchQuery}
          currentFamily={selectedFamily}
          currentSort={sortBy}
          currentStatus={statusFilter}
        />

        {isAnimalsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <AnimalGrid animals={filteredAnimals} />
        )}
      </div>
    </DashboardLayout>
  );
}