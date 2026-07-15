"use client";

import { cn } from "@/lib/utils";
import { useTaxonomySuggestions } from "@/hooks/use-taxonomy-suggestions";

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

export default function TaxonomyCombobox({
  field,
  value,
  onChange,
  placeholder,
  className,
  filters,
}: TaxonomyComboboxProps) {
  const {
    suggestions,
    isOpen,
    setIsOpen,
    highlightIndex,
    containerRef,
    inputRef,
    selectSuggestion,
    handleKeyDown,
    fetchSuggestions,
    isFromDb,
    setIsFocused,
  } = useTaxonomySuggestions({
    field,
    value,
    onChange,
    filters,
  });

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