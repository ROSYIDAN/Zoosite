"use client";

import { useState } from "react";
import BreadcrumbLink from "@/components/breadcrumbs/BreadcrumbLink";
import ImageWithSkeleton from "@/components/loading/ImageWithSkeleton";
import { cn } from "@/lib/utils";

interface Animal {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

interface AnimalCardGridProps {
  animals: Animal[];
  /** The label of the current page to push onto the breadcrumb trail */
  currentPageLabel: string;
}

const ITEMS_PER_PAGE = 12;

export default function AnimalCardGrid({ animals, currentPageLabel }: AnimalCardGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(animals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAnimals = animals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of grid or page when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (animals.length === 0) return null;

  return (
    <div className="space-y-10">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedAnimals.map((animal, idx) => (
          <BreadcrumbLink
            key={animal.id}
            href={`/animals/${animal.slug}`}
            breadcrumbLabel={currentPageLabel}
            className="group bg-surface-container-low rounded-2xl overflow-hidden hover:shadow-xl transition-all border border-outline-variant/10"
          >
            <div className="aspect-video relative overflow-hidden bg-surface-container-high">
              {animal.image ? (
                <ImageWithSkeleton
                  src={animal.image}
                  fallbackSrc="/static_image.png"
                  alt={animal.name}
                  priority={idx < 4}
                  isCard={true}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  containerClassName="absolute inset-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant opacity-20">
                  <span className="material-symbols-outlined text-4xl">pets</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="font-bold text-lg group-hover:text-primary transition-colors">{animal.name}</h2>
            </div>
          </BreadcrumbLink>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border transition-colors",
              currentPage === 1
                ? "border-outline-variant/30 text-outline-variant/30 cursor-not-allowed"
                : "border-outline-variant hover:bg-surface-container text-primary"
            )}
            aria-label="Previous Page"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Logic to show a limited number of page buttons if totalPages is large
              // For simplicity with 50+ items (approx 5 pages), we can show all for now.
              // If pages > 7, we could implement an ellipsis strategy.
              if (totalPages > 7) {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "w-10 h-10 rounded-full font-medium text-sm transition-colors",
                        currentPage === page
                          ? "bg-primary text-on-primary"
                          : "hover:bg-surface-container text-on-surface"
                      )}
                    >
                      {page}
                    </button>
                  );
                }
                if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="w-10 h-10 flex items-center justify-center text-on-surface-variant">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "w-10 h-10 rounded-full font-medium text-sm transition-colors",
                    currentPage === page
                      ? "bg-primary text-on-primary"
                      : "hover:bg-surface-container text-on-surface"
                  )}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border transition-colors",
              currentPage === totalPages
                ? "border-outline-variant/30 text-outline-variant/30 cursor-not-allowed"
                : "border-outline-variant hover:bg-surface-container text-primary"
            )}
            aria-label="Next Page"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
