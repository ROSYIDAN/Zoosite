"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A-Z)", sort: "name", order: "asc" },
  { value: "name-desc", label: "Name (Z-A)", sort: "name", order: "desc" },
  { value: "created_at-desc", label: "Newest Added", sort: "created_at", order: "desc" },
  { value: "created_at-asc", label: "Oldest Added", sort: "created_at", order: "asc" },
];

export default function ArchiveSortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Determine current active option based on search params, defaulting to Name (A-Z)
  const currentSort = searchParams.get("sort") || "name";
  const currentOrder = searchParams.get("order") || "asc";
  const activeOption = SORT_OPTIONS.find(
    (opt) => opt.sort === currentSort && opt.order === currentOrder
  ) || SORT_OPTIONS[0];

  const handleSelect = (option: typeof SORT_OPTIONS[0]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", option.sort);
    params.set("order", option.order);
    params.delete("page"); // Reset to page 1 on sort change
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-full sm:w-48">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-[#c2c9bb] bg-[#fafaf5] hover:bg-[#f0f2eb] text-sm text-[#1a1c19] focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/30 transition-all font-medium"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2d5a27] text-lg">sort</span>
          <span>{activeOption.label}</span>
        </div>
        <span className="material-symbols-outlined text-[#1a1c19]/60 text-lg transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "none" }}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <>
          {/* Overlay to handle clicking outside to close */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-2 w-full sm:w-48 rounded-xl bg-[#fafaf5] border border-[#c2c9bb] shadow-lg focus:outline-none z-50 overflow-hidden py-1">
            {SORT_OPTIONS.map((option) => {
              const isSelected = option.value === activeOption.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                    isSelected
                      ? "bg-[#2d5a27]/10 text-[#2d5a27] font-semibold"
                      : "text-[#1a1c19] hover:bg-[#2d5a27]/5"
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[#2d5a27] text-sm">
                      check
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}