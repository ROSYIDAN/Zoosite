"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SearchedCountry {
  id: string;
  name: string;
  flagUrl: string;
}

interface CountrySearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectCountry: (country: { name: string; flagUrl: string }) => void;
  placeholder?: string;
  className?: string;
}

export default function CountrySearchInput({
  value,
  onChange,
  onSelectCountry,
  placeholder = "Search country...",
  className,
}: CountrySearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState<SearchedCountry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state with outside value changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/countries/search?q=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Failed fetching country suggestions", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelect = (country: SearchedCountry) => {
    onSelectCountry({
      name: country.name,
      flagUrl: country.flagUrl,
    });
    setSearchTerm(country.name);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => setIsOpen(suggestions.length > 0)}
          className="w-full bg-white border border-[#c2c9bb]/60 rounded-lg pl-9 pr-8 py-2 text-sm text-[#1a1c19] font-['Manrope'] focus:border-[#2d5a27] focus:outline-none focus:ring-1 focus:ring-[#2d5a27]/20 transition-all placeholder:text-[#72796e]"
          placeholder={placeholder}
        />
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#72796e] text-[18px] pointer-events-none">
          public
        </span>
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#2d5a27] border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-[#c2c9bb] rounded-xl shadow-lg z-30 divide-y divide-[#eeeee9]">
          {suggestions.map((country) => (
            <button
              key={country.id}
              type="button"
              onClick={() => handleSelect(country)}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#fafaf5] transition-colors"
            >
              {country.flagUrl ? (
                <img
                  src={country.flagUrl}
                  alt={country.name}
                  className="w-6 h-4 rounded object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                />
              ) : (
                <div className="w-6 h-4 rounded bg-[#2d5a27]/10 flex items-center justify-center text-[#2d5a27] shrink-0">
                  <span className="material-symbols-outlined text-[10px]">flag</span>
                </div>
              )}
              <span className="text-xs font-bold text-[#1a1c19] font-['Manrope']">{country.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
