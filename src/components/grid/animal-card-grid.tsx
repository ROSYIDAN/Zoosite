"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import BreadcrumbLink from "@/components/breadcrumbs/BreadcrumbLink";
import AnimalCardPagination from "@/components/grid/animal-card-pagination";
import ImageWithSkeleton from "@/components/loading/ImageWithSkeleton";

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
  initialPage?: number;
  search?: string;
}

const ITEMS_PER_PAGE = 12;
const DEFAULT_PAGE = 1;

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, DEFAULT_PAGE), Math.max(totalPages, DEFAULT_PAGE));
}

function getPageFromParam(value: string | null, fallback: number, totalPages: number) {
  const parsed = value ? Number.parseInt(value, 10) : fallback;
  return Number.isFinite(parsed) && parsed > 0 ? clampPage(parsed, totalPages) : clampPage(fallback, totalPages);
}

export default function AnimalCardGrid({ animals, currentPageLabel, initialPage = DEFAULT_PAGE, search }: AnimalCardGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const totalPages = Math.ceil(animals.length / ITEMS_PER_PAGE);
  const safeInitialPage = getPageFromParam(null, initialPage, totalPages);
  const [currentPage, setCurrentPage] = useState(safeInitialPage);

  useEffect(() => {
    setCurrentPage(safeInitialPage);
  }, [safeInitialPage]);

  const handlePageChange = (page: number) => {
    const nextPage = getPageFromParam(String(page), currentPage, totalPages);
    setCurrentPage(nextPage);

    const params = new URLSearchParams();
    if (search) {
      params.set("search", search);
    }
    if (nextPage === DEFAULT_PAGE) {
      params.delete("page");
    } else {
      params.set("page", nextPage.toString());
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const createAnimalHref = (slug: string) => {
    const params = new URLSearchParams();
    if (search) {
      params.set("search", search);
    }
    params.set("page", currentPage.toString());
    const queryString = params.toString();
    return `/animals/${slug}${queryString ? `?${queryString}` : ""}`;
  };

  if (animals.length === 0) return null;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAnimals = animals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-10">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedAnimals.map((animal, idx) => (
          <BreadcrumbLink
            key={animal.id}
            href={createAnimalHref(animal.slug)}
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

      <AnimalCardPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
