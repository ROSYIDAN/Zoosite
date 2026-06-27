"use client";

import { useState } from "react";

interface FilterBarProps {
  onSearchChange: (search: string) => void;
  onFamilyChange: (family: string) => void;
  onSortChange: (sort: string) => void;
  onStatusChange: (status: "ALL" | "NATIVE" | "ENDEMIC") => void;
  families: string[];
  currentSearch: string;
  currentFamily: string;
  currentSort: string;
  currentStatus: "ALL" | "NATIVE" | "ENDEMIC";
}

/**
 * FilterBar - Search and filter controls for native animals page
 * Provides search, family filter, and sorting options
 */
export default function FilterBar({
  onSearchChange,
  onFamilyChange,
  onSortChange,
  onStatusChange,
  families,
  currentSearch,
  currentFamily,
  currentSort,
  currentStatus,
}: FilterBarProps) {
  const [showFamilyDropdown, setShowFamilyDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

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

  const hasActiveFilters = currentSearch || currentFamily || currentSort !== "name-asc" || currentStatus !== "ALL";

  const handleClearFilters = () => {
    onSearchChange("");
    onFamilyChange("");
    onSortChange("name-asc");
    onStatusChange("ALL");
  };

  return (
    <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
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
            placeholder="Search endemic animals..."
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
              <span className="text-on-surface">
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

        {/* Family Filter */}
        <div className="relative">
          <button
            onClick={() => setShowFamilyDropdown(!showFamilyDropdown)}
            className="w-full md:w-48 px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface-container hover:border-primary/30 transition-colors flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">
                category
              </span>
              <span className="text-on-surface">
                {currentFamily || "All Families"}
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-xl">
              expand_more
            </span>
          </button>

          {showFamilyDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowFamilyDropdown(false)}
              />
              <div className="absolute left-0 md:right-0 md:left-auto mt-2 w-full md:w-64 max-h-64 overflow-y-auto bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-xl z-50">
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
              <span className="text-on-surface">
                {sortOptions.find((opt) => opt.value === currentSort)?.label ||
                  "Sort"}
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
    </div>
  );
}