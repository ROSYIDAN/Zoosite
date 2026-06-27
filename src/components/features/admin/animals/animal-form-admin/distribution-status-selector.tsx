"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type DistributionStatus = "ENDEMIC" | "NATIVE" | "INTRODUCED" | "EXTINCT";

interface DistributionStatusSelectorProps {
  countryId: string;
  countryName: string;
  currentStatus?: DistributionStatus;
  onChange: (countryId: string, status: DistributionStatus) => void;
}

const STATUS_OPTIONS: {
  value: DistributionStatus;
  label: string;
  description: string;
  icon: string;
  color: string;
}[] = [
  {
    value: "NATIVE",
    label: "Native",
    description: "Naturally occurs in this region",
    icon: "home",
    color: "text-blue-600",
  },
  {
    value: "ENDEMIC",
    label: "Endemic",
    description: "Found only in this country",
    icon: "kid_star",
    color: "text-amber-600",
  },
  {
    value: "INTRODUCED",
    label: "Introduced",
    description: "Non-native, brought by humans",
    icon: "flight_land",
    color: "text-purple-600",
  },
  {
    value: "EXTINCT",
    label: "Extinct",
    description: "No longer exists in this region",
    icon: "close",
    color: "text-red-600",
  },
];

/**
 * DistributionStatusSelector - Admin component to mark distribution status per country
 * Allows marking animals as endemic, native, introduced, or extinct in each country
 */
export default function DistributionStatusSelector({
  countryId,
  countryName,
  currentStatus = "NATIVE",
  onChange,
}: DistributionStatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = STATUS_OPTIONS.find((opt) => opt.value === currentStatus);

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors border",
          currentOption?.color,
          "bg-white hover:bg-gray-50 border-gray-200"
        )}
        title={`Distribution status: ${currentOption?.label}`}
      >
        <span
          className={cn("material-symbols-outlined text-[14px]", currentOption?.color)}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {currentOption?.icon}
        </span>
        <span className="text-gray-700">{currentOption?.label}</span>
        <span className="material-symbols-outlined text-[12px] text-gray-400">
          expand_more
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute z-50 mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[240px] overflow-hidden">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">
                Distribution Status
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">{countryName}</p>
            </div>

            <div className="py-1">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(countryId, option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-start gap-2",
                    currentStatus === option.value && "bg-gray-50"
                  )}
                >
                  <span
                    className={cn(
                      "material-symbols-outlined text-[18px] mt-0.5",
                      option.color
                    )}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {option.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {option.label}
                      </span>
                      {currentStatus === option.value && (
                        <span className="material-symbols-outlined text-primary text-[16px]">
                          check
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {option.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}