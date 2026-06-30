"use client";

import { useState, useEffect } from "react";
import NativeAnimalCard from "@/components/features/dashboard/native-animals/native-animal-card";
import AnimalCardPagination from "@/components/grid/animal-card-pagination";
import type { NativeAnimalItem } from "@/types/native-animals.types";

interface AnimalGridProps {
  animals: NativeAnimalItem[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 12;

/**
 * AnimalGrid - Responsive grid of animal cards with client-side pagination
 * Reuses NativeAnimalCard from dashboard and AnimalCardPagination
 */
export default function AnimalGrid({ animals, isLoading }: AnimalGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when the list of animals changes (due to filtering, search, or country change)
  useEffect(() => {
    setCurrentPage(1);
  }, [animals]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-low h-82 rounded-2xl animate-pulse border border-outline-variant/10"
          />
        ))}
      </div>
    );
  }

  if (animals.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-2xl p-12 border border-outline-variant/10 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">
          search_off
        </span>
        <h3 className="text-xl font-bold text-on-surface font-headline mb-2">
          No Animals Found
        </h3>
        <p className="text-sm text-on-surface-variant">
          Try adjusting your search or filters to find what you're looking
          for
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(animals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAnimals = animals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">
          Showing <strong className="text-on-surface">{animals.length}</strong>{" "}
          endemic {animals.length === 1 ? "species" : "species"}
        </p>
      </div>

      {/* Animal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedAnimals.map((animal, idx) => (
          <NativeAnimalCard key={animal.id} animal={animal} priority={idx < 4} />
        ))}
      </div>

      {/* Pagination */}
      <AnimalCardPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
