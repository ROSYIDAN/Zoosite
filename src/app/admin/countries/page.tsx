"use client";

import { useCountryManagement } from "@/hooks/use-country-management";
import CountryStats from "@/components/features/admin/countries/CountryStats";
import CountryFilters from "@/components/features/admin/countries/CountryFilters";
import CountryTable from "@/components/features/admin/countries/CountryTable";
import CountryModal from "@/components/features/admin/countries/CountryModal";

export default function ManageCountriesPage() {
  const {
    loading,
    searchQuery,
    setSearchQuery,
    selectedRegionId,
    setSelectedRegionId,
    currentPage,
    setCurrentPage,
    ITEMS_PER_PAGE,
    isModalOpen,
    setIsModalOpen,
    editingCountry,
    formCountryName,
    setFormCountryName,
    formCountryFlag,
    setFormCountryFlag,
    formRegionId,
    setFormRegionId,
    isSubmitting,
    regions,
    openModal,
    handleSubmit,
    paginatedCountries,
    totalItems,
    totalPages,
    totalCountries,
    countriesWithFlags,
    totalRegions,
  } = useCountryManagement();

  return (
    <div className="p-10 max-w-7xl mx-auto flex flex-col gap-10">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="h-px w-12 bg-primary-container/30" />
            <span className="font-['Manrope'] text-[12px] font-bold uppercase tracking-[0.2em] text-primary-container">
              Geographical Admin
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
            Manage Countries & Flags
          </h1>
          <p className="mt-2 font-['Manrope'] text-sm text-[#1a1c19]/60 max-w-2xl">
            Configure countries, map them to geographical continents or regions, and assign flag emojis or custom URLs.
          </p>
        </div>

        <button
          onClick={() => openModal(null)}
          className="flex items-center gap-2 px-6 py-3.5 bg-primary-container hover:bg-[#20401b] text-white text-sm font-bold font-['Manrope'] rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Register Country
        </button>
      </header>

      {/* Stats Summary Panel */}
      <CountryStats
        loading={loading}
        totalCountries={totalCountries}
        countriesWithFlags={countriesWithFlags}
        totalRegions={totalRegions}
      />

      {/* Filter Toolbar */}
      <CountryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRegionId={selectedRegionId}
        setSelectedRegionId={setSelectedRegionId}
        regions={regions}
      />

      {/* Main Content Grid & Table */}
      <CountryTable
        loading={loading}
        paginatedCountries={paginatedCountries}
        onEdit={openModal}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        setCurrentPage={setCurrentPage}
      />

      {/* Creation / Editing Modal */}
      <CountryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        editingCountry={editingCountry}
        formCountryName={formCountryName}
        setFormCountryName={setFormCountryName}
        formCountryFlag={formCountryFlag}
        setFormCountryFlag={setFormCountryFlag}
        formRegionId={formRegionId}
        setFormRegionId={setFormRegionId}
        regions={regions}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}