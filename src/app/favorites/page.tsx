"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavigationBreadcrumbs from "@/components/breadcrumbs/NavigationBreadcrumbs";
import AnimalCardGrid from "@/components/grid/animal-card-grid";
import { useFavorites } from "@/store/useFavorites";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="px-8 py-10 max-w-full mx-auto min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-8 py-10 max-w-full mx-auto">
      <NavigationBreadcrumbs currentPageLabel="My Zoo" className="mb-8" />
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="text-5xl font-extrabold tracking-tighter text-primary mb-4 flex items-center gap-4">
          <span className="material-symbols-outlined text-5xl">favorite</span>
          My Virtual Zoo
        </h2>
        <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed font-body">
          Your personal collection of favorite animals. Curate your own virtual zoo by bookmarking animals from across the globe.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-surface-container-low rounded-3xl p-12 text-center border border-outline-variant/20 mb-8">
          <div className="w-24 h-24 bg-surface-container mx-auto rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant opacity-50">pets</span>
          </div>
          <h3 className="text-2xl font-bold text-on-surface mb-4">Your Virtual Zoo is Empty</h3>
          <p className="text-on-surface-variant max-w-md mx-auto mb-8 text-lg">
            You haven't added any animals to your zoo yet. Explore the world's regions and habitats to find your favorites!
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/regions" 
              className="bg-primary text-on-primary px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">public</span>
              Browse Regions
            </Link>
            <Link 
              href="/habitats" 
              className="bg-secondary-container text-on-secondary-container px-6 py-3 rounded-full font-medium hover:bg-secondary-container/80 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">eco</span>
              Browse Habitats
            </Link>
          </div>
        </div>
      ) : (
        <AnimalCardGrid animals={favorites} currentPageLabel="My Zoo" />
      )}

      <div className="mt-12">
        <Link href="/dashboard" className="text-primary hover:underline flex items-center gap-2 font-medium">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
