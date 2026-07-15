import { useState, useEffect, useRef, useCallback } from "react";
import { useClickOutside } from "./use-click-outside";

interface UseTaxonomySuggestionsProps {
  field: "genus" | "family" | "ordo";
  value: string;
  onChange: (value: string) => void;
  filters?: {
    class_id?: string;
    family?: string;
    ordo?: string;
  };
}

// Simple in-memory cache: key → { data, timestamp }
const suggestionCache = new Map<string, { data: string[]; ts: number }>();
const CACHE_TTL_MS = 60_000; // 1 minute

export function useTaxonomySuggestions({
  field,
  value,
  onChange,
  filters,
}: UseTaxonomySuggestionsProps) {
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
  useClickOutside(containerRef, () => {
    setIsOpen(false);
    setIsFocused(false);
  });

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

  return {
    suggestions,
    isOpen,
    setIsOpen,
    isFocused,
    setIsFocused,
    highlightIndex,
    setHighlightIndex,
    containerRef,
    inputRef,
    selectSuggestion,
    handleKeyDown,
    fetchSuggestions,
    isFromDb,
  };
}