"use client";

import { useState, useEffect } from "react";
import { useRecentAssets } from "@/store/useRecentAssets";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  image: string;
  scientific_name?: string;
}

interface SearchModeProps {
  onSelect: (url: string, refId: string | null) => void;
}

type SearchType = "ANIMALS" | "FLAGS";

export default function SearchMode({ onSelect }: SearchModeProps) {
  const { recentImages } = useRecentAssets();
  const [searchType, setSearchType] = useState<SearchType | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim() || !searchType) {
      setResults([]);
      return;
    }

    const endpoint = searchType === "ANIMALS" ? "/api/animals" : "/api/countries";

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${endpoint}?search=${encodeURIComponent(query)}&limit=8`);
        if (res.ok) {
          const json = await res.json();
          setResults(json.data || []);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchType]);

  const resetSearch = () => {
    setSearchType(null);
    setQuery("");
    setResults([]);
  };

  if (!searchType) {
    return (
      <div className="w-full space-y-4 py-4">
        <p className="text-[10px] font-bold text-[#72796e] uppercase tracking-widest text-center">Select Search Type</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setSearchType("ANIMALS")}
            className="flex flex-rows items-center justify-center gap-3 p-6 rounded-2xl border-2 border-[#c2c9bb] hover:border-[#2d5a27] hover:bg-[#2d5a27]/5 transition-all group"
          >
            <span className="material-symbols-outlined text-[32px] text-[#42493e] group-hover:text-[#2d5a27]">pet_supplies</span>
            <span className="text-xs font-bold text-[#1a1c19]">Search Animals</span>
          </button>
          <button
            type="button"
            onClick={() => setSearchType("FLAGS")}
            className="flex flex-rows items-center justify-center gap-3 p-6 rounded-2xl border-2 border-[#c2c9bb] hover:border-[#2d5a27] hover:bg-[#2d5a27]/5 transition-all group"
          >
            <span className="material-symbols-outlined text-[32px] text-[#42493e] group-hover:text-[#2d5a27]">flag</span>
            <span className="text-xs font-bold text-[#1a1c19]">Search Flags</span>
          </button>
        </div>
        {recentImages.length > 0 && (
          <div className="pt-4 border-t border-[#e3e3de] space-y-2 text-left">
            <p className="text-[10px] font-bold text-[#72796e] uppercase tracking-wider">Recent Assets</p>
            <div className="grid grid-cols-4 gap-2">
              {recentImages.slice(0, 4).map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => onSelect(img, null)}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-[#e3e3de] hover:border-[#2d5a27] transition-all"
                >
                  <img src={img} alt="Recent" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Search Header with Back Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={resetSearch}
          className="p-2 rounded-lg hover:bg-[#eeeee9] text-[#72796e] transition-colors"
          title="Back to selection"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={searchType === "ANIMALS" ? "Search animals (e.g. Lion)..." : "Search countries (e.g. Brazil)..."}
            className="w-full bg-white border border-[#c2c9bb] rounded-xl px-4 py-2 text-sm focus:border-[#2d5a27] focus:ring-1 focus:ring-[#2d5a27] outline-none transition-all"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isLoading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined animate-spin text-[#2d5a27] text-[18px]">
              progress_activity
            </span>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {results.length > 0 && (
        <div className="space-y-2 text-left">
          <p className="text-[10px] font-bold text-[#72796e] uppercase tracking-wider">Search Results</p>
          <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
          {results.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => onSelect(item.image, item.id)}
                className="group relative aspect-square rounded-lg overflow-hidden border border-[#e3e3de] hover:border-[#2d5a27] transition-all bg-white"
                title={item.name}
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className={cn("w-full h-full", searchType === "FLAGS" ? "object-contain p-2" : "object-cover")}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const placeholder = target.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = "flex";
                  }}
                />
                <div className="w-full h-full items-center justify-center text-[#c2c9bb] hidden">
                  <span className="material-symbols-outlined text-[28px]">hide_image</span>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-center">
                  <span className="text-[8px] text-white font-bold leading-tight">{item.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Not Found / CTA */}
      {query && results.length === 0 && !isLoading && (
        <div className="py-4 px-2 bg-[#fcfcf7] border border-[#e3e3de] rounded-xl text-center">
          <p className="text-[11px] text-[#72796e] mb-2 font-medium">No results found for &quot;{query}&quot;</p>
          {searchType === "ANIMALS" && (
            <button
              type="button"
              className="text-[10px] font-bold text-[#2d5a27] hover:underline flex items-center justify-center gap-1 mx-auto"
              onClick={() => alert("Redirecting to Animal Creation (To be implemented)...")}
            >
              <span className="material-symbols-outlined text-[14px]">add_circle</span>
              ADD NEW ANIMAL TO ARCHIVE
            </button>
          )}
        </div>
      )}
    </div>
  );
}

