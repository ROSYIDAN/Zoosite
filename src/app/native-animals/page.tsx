"use client";

import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";
import PageHeader from "@/components/features/native-animals/page-header";
import FilterBar from "@/components/features/native-animals/filter-bar";
import AnimalGrid from "@/components/features/native-animals/animal-grid";
import { useNativeAnimalsPage } from "@/hooks/use-native-animals-page";

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