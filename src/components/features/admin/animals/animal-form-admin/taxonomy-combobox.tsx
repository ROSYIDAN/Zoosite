"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TaxonomyComboboxProps {
  field: "genus" | "family" | "ordo";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Optional filters to narrow down suggestions based on other taxonomy fields */
  filters?: {
    class_id?: string;
    family?: string;
    ordo?: string;
  };
}

// Simple in-memory cache: key → { data, timestamp }
const suggestionCache = new Map<string, { data: string[]; ts: number }>();
const CACHE_TTL_MS = 60_000; // 1 minute

export default function TaxonomyCombobox({
  field,
  value,
  onChange,
  placeholder,
  className,
  filters,
}: TaxonomyComboboxProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(
    async (query: string) => {
      const urlParams = new URLSearchParams({ field, q: query });

      if (filters?.class_id) urlParams.set("class_id", filters.class_id);
      if (filters?.family) urlParams.set("family", filters.family);
      if (filters?.ordo) urlParams.set("ordo", filters.ordo);

      const cacheKey = urlParams.toString();

      // Check cache first
      const cached = suggestionCache.get(cacheKey);
      if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
        setSuggestions(cached.data);
        setIsOpen(cached.data.length > 0 && isFocused);
        return;
      }

      try {
        const res = await fetch(`/api/animals/taxonomy?${cacheKey}`);
        if (res.ok) {
          const data: string[] = await res.json();
          // Store in cache
          suggestionCache.set(cacheKey, { data, ts: Date.now() });
          setSuggestions(data);
          setIsOpen(data.length > 0 && isFocused);
        }
      } catch {
        setSuggestions([]);
      }
    },
    [field, isFocused, filters?.class_id, filters?.family, filters?.ordo]
  );

  // Debounced search on value change
  useEffect(() => {
    if (!isFocused) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, isFocused, fetchSuggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectSuggestion = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setHighlightIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0) {
          selectSuggestion(suggestions[highlightIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightIndex(-1);
        break;
    }
  };

  // Check if current value exactly matches a suggestion
  const isFromDb = suggestions.some(
    (s) => s.toLowerCase() === value.toLowerCase()
  );

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            fetchSuggestions(value);
          }}
          onBlur={() => {
            // Delayed blur to allow click on dropdown items
            setTimeout(() => {
              if (
                containerRef.current &&
                !containerRef.current.contains(document.activeElement)
              ) {
                setIsFocused(false);
                setIsOpen(false);
              }
            }, 150);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all font-['Manrope'] w-full pr-8",
            className
          )}
          autoComplete="off"
        />
        {/* DB indicator badge */}
        {value && isFromDb && (
          <span
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-600"
            title="Matched from database"
          >
            <span className="material-symbols-outlined text-[12px]">
              database
            </span>
            <span className="text-[9px] font-bold tracking-wide uppercase font-['Manrope']">
              DB
            </span>
          </span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-outline-variant rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-2 bg-surface-container-low border-b border-outline-variant">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 font-['Manrope'] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[12px]">
                database
              </span>
              Existing in Database ({suggestions.length})
            </p>
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {suggestions.map((suggestion, i) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onClick={() => selectSuggestion(suggestion)}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm font-['Manrope'] transition-colors flex items-center justify-between group",
                    highlightIndex === i
                      ? "bg-primary-container/10 text-primary"
                      : "text-on-surface hover:bg-surface-container-low"
                  )}
                >
                  <span>
                    {/* Highlight the matching part */}
                    {value
                      ? highlightMatch(suggestion, value)
                      : suggestion}
                  </span>
                  <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-60 transition-opacity">
                    north_west
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Highlights the matching substring in bold */
function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <strong className="text-primary font-bold">
        {text.slice(idx, idx + query.length)}
      </strong>
      {text.slice(idx + query.length)}
    </>
  );
}
