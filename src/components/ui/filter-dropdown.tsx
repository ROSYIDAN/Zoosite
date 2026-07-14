"use client";

import { useState } from "react";

export interface FilterDropdownOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  icon: string;
  placeholder: string;
  currentValue: string;
  options: FilterDropdownOption[];
  onChange: (value: string) => void;
  /** Color accent for icon and active/hover states. Defaults to "primary" */
  accent?: "primary" | "tertiary";
  /** Additional CSS classes for the root container */
  className?: string;
}

/**
 * FilterDropdown - Reusable dropdown selector with icon, label, and click-outside-close.
 * Used across filter bars to eliminate repeated dropdown boilerplate.
 */
export default function FilterDropdown({
  icon,
  placeholder,
  currentValue,
  options,
  onChange,
  accent = "primary",
  className = "",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  const displayLabel =
    options.find((o) => o.value === currentValue)?.label ?? placeholder;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface-container hover:border-${accent}/30 transition-colors flex items-center justify-between text-sm`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span
            className={`material-symbols-outlined text-${accent} text-xl flex-shrink-0`}
          >
            {icon}
          </span>
          <span className="text-on-surface truncate">{displayLabel}</span>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant text-xl flex-shrink-0">
          expand_more
        </span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-full max-h-64 overflow-y-auto bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-xl z-50">
            <div className="p-2">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-${accent}/10 transition-colors text-sm ${
                    currentValue === option.value ? `bg-${accent}/5` : ""
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
  );
}