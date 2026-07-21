import React from "react";
import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";

/**
 * Loading skeleton for the main Animals Archive page.
 * Matching the exact layouts and design tokens of AnimalsArchivePage.
 */
export default function AnimalsArchiveLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1440px] mx-auto">
        {/* Header Skeleton */}
        <div className="p-6 bg-white/40 dark:bg-[#232621]/40 rounded-r-3xl rounded-l-lg border border-[#1a1c19]/5 dark:border-white/5 border-l-4 border-l-primary dark:border-l-[#d0e8c5] backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] animate-pulse">
          <div className="w-48 h-8 bg-stone-200 dark:bg-stone-800 rounded mb-2" />
          <div className="w-32 h-4 bg-stone-100 dark:bg-stone-900 rounded" />
        </div>

        {/* Filter/Search Bar Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between animate-pulse">
          {/* Search Input Skeleton */}
          <div className="flex-1 w-full max-w-2xl h-14 bg-surface-container-lowest dark:bg-[#232621]/50 rounded-2xl border border-outline-variant/10" />
          {/* Sort Dropdown Skeleton */}
          <div className="w-full sm:w-48 h-12 bg-surface-container-lowest dark:bg-[#232621]/50 rounded-xl border border-outline-variant/10" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-surface-container-low dark:bg-[#232621]/40 rounded-2xl overflow-hidden border border-outline-variant/10"
            >
              {/* Image Placeholder */}
              <div className="aspect-video bg-stone-200 dark:bg-stone-800" />
              {/* Title Placeholder */}
              <div className="p-4">
                <div className="w-2/3 h-5 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}