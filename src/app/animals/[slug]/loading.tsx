import React from "react";

export default function AnimalDetailLoading() {
  return (
    <div className="py-12 px-6 max-w-[1440px] mx-auto">
      {/* Breadcrumbs Skeleton */}
      <div className="mb-8 w-48 h-6 bg-surface-container-high rounded animate-pulse" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image Skeleton */}
        <div className="relative w-full max-w-[584px] aspect-[584/452] bg-surface-container-low rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/10 animate-pulse flex items-center justify-center">
          <span className="material-symbols-outlined text-[64px] text-primary opacity-20">image</span>
        </div>

        {/* Right Column: Detail Content Skeleton (representing Page 1 of AutoPagination) */}
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-4">
            {/* Diet/Family Badge Placeholder */}
            <div className="w-24 h-6 bg-surface-container-high rounded-full animate-pulse" />
            
            {/* Common Name Placeholder */}
            <div className="w-3/4 h-12 bg-surface-container-high rounded animate-pulse" />
            
            {/* Scientific Name Placeholder */}
            <div className="w-1/2 h-6 bg-surface-container-high rounded animate-pulse" />
          </div>

          {/* Description Prose Skeleton */}
          <div className="space-y-3 mt-6">
            <div className="w-full h-4 bg-surface-container-high rounded animate-pulse" />
            <div className="w-full h-4 bg-surface-container-high rounded animate-pulse" />
            <div className="w-5/6 h-4 bg-surface-container-high rounded animate-pulse" />
          </div>

          {/* Taxonomy Grid Skeleton */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-surface-container rounded-2xl p-4 animate-pulse space-y-2">
                <div className="w-12 h-3 bg-surface-container-high rounded" />
                <div className="w-20 h-5 bg-surface-container-highest rounded" />
              </div>
            ))}
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface-container rounded-2xl p-4 animate-pulse space-y-2">
                <div className="w-16 h-3 bg-surface-container-high rounded" />
                <div className="w-24 h-5 bg-surface-container-highest rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}