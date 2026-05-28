"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import type { Country, Region } from "@/components/features/admin/countries/types";
import CountryStats from "@/components/features/admin/countries/CountryStats";
import CountryFilters from "@/components/features/admin/countries/CountryFilters";
import CountryTable from "@/components/features/admin/countries/CountryTable";
import CountryModal from "@/components/features/admin/countries/CountryModal";

export default function ManageCountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  // Form Fields
  const [formCountryName, setFormCountryName] = useState("");
  const [formCountryFlag, setFormCountryFlag] = useState("");
  const [formRegionId, setFormRegionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [countriesRes, regionsRes] = await Promise.all([
        fetch("/api/countries?all=true"),
        fetch("/api/regions"),
      ]);

      const countriesData = await countriesRes.json();
      const regionsData = await regionsRes.json();

      setCountries(countriesData.data || []);
      setRegions(regionsData.data || []);
    } catch (error) {
      console.error("Failed to fetch country/region data:", error);
      toast.error("Failed to load countries and regions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset to first page when search filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRegionId]);

  // Open Modal for Create or Edit
  const openModal = (country: Country | null = null) => {
    if (country) {
      setEditingCountry(country);
      setFormCountryName(country.country);
      setFormCountryFlag(country.country_flag || "");
      setFormRegionId(country.region_id || "");
    } else {
      setEditingCountry(null);
      setFormCountryName("");
      setFormCountryFlag("");
      setFormRegionId("");
    }
    setIsModalOpen(true);
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCountryName.trim()) {
      toast.error("Country name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        country: formCountryName.trim(),
        country_flag: formCountryFlag.trim() || null,
        region_id: formRegionId || null,
      };

      if (editingCountry) {
        // Edit Country
        const res = await fetch("/api/countries", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCountry.id, ...payload }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to update country");
        }

        toast.success("Country updated successfully!");
      } else {
        // Create Country
        const res = await fetch("/api/countries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to create country");
        }

        toast.success("Country registered successfully!");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter countries
  const filteredCountries = countries.filter((c) => {
    const matchesSearch = c.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegionId === "" || c.region_id === selectedRegionId;
    return matchesSearch && matchesRegion;
  });

  // Paginated data calculation
  const totalItems = filteredCountries.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedCountries = filteredCountries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Derived stats
  const totalCountries = countries.length;
  const countriesWithFlags = countries.filter((c) => !!c.country_flag).length;
  const totalRegions = regions.length;

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

