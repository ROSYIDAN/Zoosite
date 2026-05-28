"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  scientific_name: string | null;
}

/**
 * HeroSearch component providing global search functionality.
 */
export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim().slice(0, 100);
    if (!trimmedQuery) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const cleanQuery = trimmedQuery.replace(/[^\w\s-]/gi, "");
        const res = await fetch(`/api/animals?search=${encodeURIComponent(cleanQuery)}&limit=10`);
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
  }, [query]);

  const handleSeeAll = () => {
    const cleanQuery = query.trim().replace(/[^\w\s-]/gi, "");
    router.push(`/animals?search=${encodeURIComponent(cleanQuery)}`);
  };

  return (
    <section className="max-w-4xl mx-auto w-full text-center space-y-6">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary font-headline">
        Discover Earth&apos;s Bio-Archive
      </h1>
      <div className="relative max-w-2xl mx-auto">
        <div className="flex items-center bg-surface-container-lowest rounded-2xl p-4 shadow-[0_8px_32px_rgba(26,28,25,0.06)] border border-outline-variant/10">
          <span className="material-symbols-outlined text-primary mr-3">search</span>
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 font-medium outline-none"
            placeholder="Search animals (e.g. fox, lion, tiger...)"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            onKeyDown={(e) => e.key === "Enter" && query.trim() && handleSeeAll()}
          />
          {isLoading && (
            <span className="animate-spin material-symbols-outlined text-primary/40 mr-3 text-sm">
              autorenew
            </span>
          )}
          <kbd className="hidden sm:inline-block px-2 py-1 bg-surface-container-high rounded text-[10px] font-bold text-on-surface-variant">
            ENTER
          </kbd>
        </div>

        {isOpen && query.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/20 z-40 overflow-hidden text-left">
            {results.length > 0 ? (
              <>
                <div className="max-h-[300px] overflow-y-auto">
                  {results.map((item, index) => (
                    <SuggestionItem
                      key={item.id}
                      title={item.name}
                      scientificName={item.scientific_name || ""}
                      hasBorder={index > 0}
                      onClick={() => item.slug && router.push(`/animals/${item.slug}`)}
                    />
                  ))}
                </div>
                <button
                  onClick={handleSeeAll}
                  className="w-full flex items-center justify-between px-4 py-3 bg-surface-container-low hover:bg-primary/5 text-sm font-semibold text-primary transition-colors border-t border-outline-variant/20"
                >
                  <span>See all matching species</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </>
            ) : (
              !isLoading && (
                <div className="px-4 py-6 text-center text-sm text-on-surface-variant/70">
                  No matching species found
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}

interface SuggestionItemProps {
  title: string;
  scientificName: string;
  hasBorder?: boolean;
  onClick: () => void;
}

function SuggestionItem({ title, scientificName, hasBorder, onClick }: SuggestionItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 px-4 py-3 hover:bg-surface-container-low cursor-pointer transition-colors",
        hasBorder && "border-t border-outline-variant/10"
      )}
    >
      <span className="material-symbols-outlined text-primary text-base">pets</span>
      <div>
        <p className="text-sm font-bold text-on-surface">{title}</p>
        <p className="text-[10px] text-primary/60 italic font-medium tracking-tight">{scientificName}</p>
      </div>
    </div>
  );
}
