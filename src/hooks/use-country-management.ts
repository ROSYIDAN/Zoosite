import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import type { Country, Region } from "@/components/features/admin/countries/types";

export function useCountryManagement() {
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

  return {
    countries,
    regions,
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
    openModal,
    handleSubmit,
    filteredCountries,
    paginatedCountries,
    totalItems,
    totalPages,
    totalCountries,
    countriesWithFlags,
    totalRegions,
  };
}