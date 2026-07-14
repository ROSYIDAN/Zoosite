"use client";

import FilterDropdown from "@/components/ui/filter-dropdown";

interface FilterBarProps {
  onSearchChange: (search: string) => void;
  onFamilyChange: (family: string) => void;
  onSortChange: (sort: string) => void;
  onStatusChange: (status: "ALL" | "NATIVE" | "ENDEMIC") => void;
  onRegionChange: (region: string) => void;
  onProvinceChange: (province: string) => void;
  onLocalityChange: (locality: string) => void;
  families: string[];
  regions: string[];
  provinces: string[];
  localities: string[];
  currentSearch: string;
  currentFamily: string;
  currentSort: string;
  currentStatus: "ALL" | "NATIVE" | "ENDEMIC";
  currentRegion: string;
  currentProvince: string;
  currentLocality: string;
}

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "recent", label: "Recently Added" },
];

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "NATIVE", label: "Native Only" },
  { value: "ENDEMIC", label: "Endemic Only" },
];

/** Build options array from a string list, with an "All X" entry prepended */
function buildOptions(items: string[], allLabel: string) {
  return [
    { value: "", label: allLabel },
    ...items.map((item) => ({ value: item, label: item })),
  ];
}

/**
 * FilterBar - Search and filter controls for native animals page
 * Provides search, family filter, location filters, and sorting options
 */
export default function FilterBar({
  onSearchChange,
  onFamilyChange,
  onSortChange,
  onStatusChange,
  onRegionChange,
  onProvinceChange,
  onLocalityChange,
  families,
  regions,
  provinces,
  localities,
  currentSearch,
  currentFamily,
  currentSort,
  currentStatus,
  currentRegion,
  currentProvince,
  currentLocality,
}: FilterBarProps) {
  const hasActiveFilters =
    currentSearch ||
    currentFamily ||
    currentRegion ||
    currentProvince ||
    currentLocality ||
    currentSort !== "name-asc" ||
    currentStatus !== "ALL";

  const handleClearFilters = () => {
    onSearchChange("");
    onFamilyChange("");
    onRegionChange("");
    onProvinceChange("");
    onLocalityChange("");
    onSortChange("name-asc");
    onStatusChange("ALL");
  };

  return (
    <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10 space-y-3">
      {/* First Row: Search, Status, Sort, Clear */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-xl">
            search
          </span>
          <input
            type="text"
            value={currentSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search animals..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/20 bg-surface-container focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
          />
        </div>

        <FilterDropdown
          icon="verified"
          placeholder="All Statuses"
          currentValue={currentStatus}
          options={STATUS_OPTIONS}
          onChange={(v) => onStatusChange(v as "ALL" | "NATIVE" | "ENDEMIC")}
          className="md:w-48"
        />

        <FilterDropdown
          icon="sort"
          placeholder="Sort"
          currentValue={currentSort}
          options={SORT_OPTIONS}
          onChange={onSortChange}
          className="md:w-48"
        />

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface-container hover:border-error/30 hover:bg-error/5 transition-colors flex items-center gap-2 text-sm text-on-surface"
          >
            <span className="material-symbols-outlined text-error text-xl">
              close
            </span>
            <span className="hidden md:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Second Row: Location and Family Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        {regions.length > 0 && (
          <FilterDropdown
            icon="public"
            accent="tertiary"
            placeholder="All Regions"
            currentValue={currentRegion}
            options={buildOptions(regions, "All Regions")}
            onChange={onRegionChange}
            className="flex-1"
          />
        )}

        {provinces.length > 0 && (
          <FilterDropdown
            icon="map"
            accent="tertiary"
            placeholder="All Provinces"
            currentValue={currentProvince}
            options={buildOptions(provinces, "All Provinces")}
            onChange={onProvinceChange}
            className="flex-1"
          />
        )}

        {localities.length > 0 && (
          <FilterDropdown
            icon="location_on"
            accent="tertiary"
            placeholder="All Locations"
            currentValue={currentLocality}
            options={buildOptions(localities, "All Locations")}
            onChange={onLocalityChange}
            className="flex-1"
          />
        )}

        <FilterDropdown
          icon="category"
          placeholder="All Families"
          currentValue={currentFamily}
          options={buildOptions(families, "All Families")}
          onChange={onFamilyChange}
          className="flex-1"
        />
      </div>
    </div>
  );
}