"use client";

import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";
import PageHeader from "@/components/features/native-animals/page-header";
import FilterBar from "@/components/features/native-animals/filter-bar";
import AnimalGrid from "@/components/features/native-animals/animal-grid";
import { useNativeAnimalsPage } from "@/hooks/use-native-animals-page";
import NativeAnimalsLoading from "./loading";

/**
 * Native Animals Page - Full page showing all native and endemic animals
 * Integrates with database and session for user country preferences
 */
export default function NativeAnimalsPage() {
  const {
    countries,
    currentCountry,
    families,
    filteredAnimals,
    locationOptions,
    isLoading,
    isAnimalsLoading,
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
    handleCountryChange,
  } = useNativeAnimalsPage();

  if (isLoading || !currentCountry) {
    return <NativeAnimalsLoading />;
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
          onRegionChange={setSelectedRegion}
          onProvinceChange={setSelectedProvince}
          onLocalityChange={setSelectedLocality}
          families={families}
          regions={locationOptions.regions}
          provinces={locationOptions.provinces}
          localities={locationOptions.localities}
          currentSearch={searchQuery}
          currentFamily={selectedFamily}
          currentSort={sortBy}
          currentStatus={statusFilter}
          currentRegion={selectedRegion}
          currentProvince={selectedProvince}
          currentLocality={selectedLocality}
        />

        {isAnimalsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-outline-variant/20 bg-white dark:bg-[#232621] overflow-hidden"
              >
                <div className="h-40 bg-stone-200 dark:bg-stone-800" />
                <div className="p-4 space-y-2">
                  <div className="h-5 w-28 bg-stone-200 dark:bg-stone-800 rounded" />
                  <div className="h-3 w-20 bg-stone-100 dark:bg-stone-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimalGrid animals={filteredAnimals} />
        )}
      </div>
    </DashboardLayout>
  );
}