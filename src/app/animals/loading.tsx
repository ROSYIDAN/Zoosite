import React from "react";

/**
 * Loading skeleton for the main Animals Archive page.
 */
export default function AnimalsArchiveLoading() {
  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      {/* Header Skeleton */}
      <div className="mb-12">
        <div className="w-64 h-12 bg-stone-200 rounded animate-pulse mb-4" />
        <div className="w-96 h-6 bg-stone-100 rounded animate-pulse" />
      </div>

      {/* Filter/Search Bar Skeleton */}
      <div className="flex gap-4 mb-10 overflow-x-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-32 h-10 bg-stone-100 rounded-full shrink-0" />
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm animate-pulse">
            {/* Image Placeholder */}
            <div className="aspect-[4/5] bg-stone-200" />
            {/* Title Placeholder */}
            <div className="p-6 space-y-3">
              <div className="w-1/2 h-4 bg-stone-100 rounded" />
              <div className="w-3/4 h-8 bg-stone-200 rounded" />
              <div className="flex gap-2 pt-2">
                <div className="w-16 h-5 bg-stone-100 rounded-full" />
                <div className="w-16 h-5 bg-stone-100 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
