"use client";

import { useState } from "react";

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
  const [showFamilyDropdown, setShowFamilyDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showLocalityDropdown, setShowLocalityDropdown] = useState(false);

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "recent", label: "Recently Added" },
  ];

  const statusOptions = [
    { value: "ALL", label: "All Statuses" },
    { value: "NATIVE", label: "Native Only" },
    { value: "ENDEMIC", label: "Endemic Only" },
  ];

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

        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="w-full md:w-48 px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface-container hover:border-primary/30 transition-colors flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">
                verified
              </span>
              <span className="text-on-surface truncate">
                {statusOptions.find((opt) => opt.value === currentStatus)?.label || "All Statuses"}
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-xl">
              expand_more
            </span>
          </button>

          {showStatusDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowStatusDropdown(false)}
              />
              <div className="absolute left-0 md:right-0 md:left-auto mt-2 w-full md:w-48 bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-xl z-50">
                <div className="p-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onStatusChange(option.value as any);
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm ${
                        currentStatus === option.value ? "bg-primary/5" : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="w-full md:w-48 px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface-container hover:border-primary/30 transition-colors flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">
                sort
              </span>
              <span className="text-on-surface truncate">
                {sortOptions.find((opt) => opt.value === currentSort)?.label || "Sort"}
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-xl">
              expand_more
            </span>
          </button>

          {showSortDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSortDropdown(false)}
              />
              <div className="absolute left-0 md:right-0 md:left-auto mt-2 w-full md:w-48 bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-xl z-50">
                <div className="p-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm ${
                        currentSort === option.value ? "bg-primary/5" : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

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
        {/* Region Filter */}
        {regions.length > 0 && (
          <div className="relative flex-1">
            <button
              onClick={() => setShowRegionDropdown(!showRegionDropdown)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface-container hover:border-tertiary/30 transition-colors flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="material-symbols-outlined text-tertiary text-xl flex-shrink-0">
                  public
                </span>
                <span className="text-on-surface truncate">
                  {currentRegion || "All Regions"}
                </span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-xl flex-shrink-0">
                expand_more
              </span>
            </button>

            {showRegionDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowRegionDropdown(false)}
                />
                <div className="absolute left-0 mt-2 w-full max-h-64 overflow-y-auto bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-xl z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        onRegionChange("");
                        setShowRegionDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-tertiary/10 transition-colors text-sm ${
                        !currentRegion ? "bg-tertiary/5" : ""
                      }`}
                    >
                      All Regions
                    </button>
                    {regions.map((region) => (
                      <button
                        key={region}
                        onClick={() => {
                          onRegionChange(region);
                          setShowRegionDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-tertiary/10 transition-colors text-sm ${
                          currentRegion === region ? "bg-tertiary/5" : ""
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Province Filter */}
        {provinces.length > 0 && (
          <div className="relative flex-1">
            <button
              onClick={() => setShowProvinceDropdown(!showProvinceDropdown)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface-container hover:border-tertiary/30 transition-colors flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="material-symbols-outlined text-tertiary text-xl flex-shrink-0">
                  map
                </span>
                <span className="text-on-surface truncate">
                  {currentProvince || "All Provinces"}
                </span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-xl flex-shrink-0">
                expand_more
              </span>
            </button>

            {showProvinceDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProvinceDropdown(false)}
                />
                <div className="absolute left-0 mt-2 w-full max-h-64 overflow-y-auto bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-xl z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        onProvinceChange("");
                        setShowProvinceDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-tertiary/10 transition-colors text-sm ${
                        !currentProvince ? "bg-tertiary/5" : ""
                      }`}
                    >
                      All Provinces
                    </button>
                    {provinces.map((province) => (
                      <button
                        key={province}
                        onClick={() => {
                          onProvinceChange(province);
                          setShowProvinceDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-tertiary/10 transition-colors text-sm ${
                          currentProvince === province ? "bg-tertiary/5" : ""
                        }`}
                      >
                        {province}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Locality Filter */}
        {localities.length > 0 && (
          <div className="relative flex-1">
            <button
              onClick={() => setShowLocalityDropdown(!showLocalityDropdown)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface-container hover:border-tertiary/30 transition-colors flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="material-symbols-outlined text-tertiary text-xl flex-shrink-0">
                  location_on
                </span>
                <span className="text-on-surface truncate">
                  {currentLocality || "All Locations"}
                </span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-xl flex-shrink-0">
                expand_more
              </span>
            </button>

            {showLocalityDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLocalityDropdown(false)}
                />
                <div className="absolute left-0 mt-2 w-full max-h-64 overflow-y-auto bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-xl z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        onLocalityChange("");
                        setShowLocalityDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-tertiary/10 transition-colors text-sm ${
                        !currentLocality ? "bg-tertiary/5" : ""
                      }`}
                    >
                      All Locations
                    </button>
                    {localities.map((locality) => (
                      <button
                        key={locality}
                        onClick={() => {
                          onLocalityChange(locality);
                          setShowLocalityDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-tertiary/10 transition-colors text-sm ${
                          currentLocality === locality ? "bg-tertiary/5" : ""
                        }`}
                      >
                        {locality}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Family Filter */}
        <div className="relative flex-1">
          <button
            onClick={() => setShowFamilyDropdown(!showFamilyDropdown)}
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface-container hover:border-primary/30 transition-colors flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">
                category
              </span>
              <span className="text-on-surface truncate">
                {currentFamily || "All Families"}
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-xl flex-shrink-0">
              expand_more
            </span>
          </button>

          {showFamilyDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowFamilyDropdown(false)}
              />
              <div className="absolute left-0 mt-2 w-full max-h-64 overflow-y-auto bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-xl z-50">
                <div className="p-2">
                  <button
                    onClick={() => {
                      onFamilyChange("");
                      setShowFamilyDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm ${
                      !currentFamily ? "bg-primary/5" : ""
                    }`}
                  >
                    All Families
                  </button>
                  {families.map((family) => (
                    <button
                      key={family}
                      onClick={() => {
                        onFamilyChange(family);
                        setShowFamilyDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm ${
                        currentFamily === family ? "bg-primary/5" : ""
                      }`}
                    >
                      {family}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}