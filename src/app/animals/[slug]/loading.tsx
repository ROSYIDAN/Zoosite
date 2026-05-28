import React from "react";

/**
 * Loading skeleton for the Animal Detail page.
 * Provides instant feedback (YouTube-style) when navigating to an animal.
 */
export default function AnimalDetailLoading() {
  return (
    <div className="min-h-screen bg-[#fafaf5] pb-20">
      {/* Hero Section Skeleton */}
      <div className="relative h-[60vh] w-full bg-stone-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-[#fafaf5] to-transparent" />
        <div className="absolute bottom-12 left-8 right-8 max-w-4xl mx-auto">
          <div className="w-48 h-6 bg-stone-300 rounded mb-4" />
          <div className="w-96 h-16 bg-stone-300 rounded" />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-8 -mt-8 relative z-10 space-y-12">
        {/* Characteristics Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm animate-pulse">
              <div className="w-8 h-8 bg-stone-200 rounded-full mb-3" />
              <div className="w-12 h-3 bg-stone-100 rounded mb-2" />
              <div className="w-20 h-5 bg-stone-200 rounded" />
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="w-full h-4 bg-stone-200 rounded" />
            <div className="w-full h-4 bg-stone-200 rounded" />
            <div className="w-3/4 h-4 bg-stone-200 rounded" />
            
            <div className="pt-8 space-y-4">
              <div className="w-48 h-8 bg-stone-200 rounded" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-40 bg-stone-100 rounded-2xl" />
                <div className="h-40 bg-stone-100 rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <div className="bg-[#f4f4ef] p-8 rounded-3xl animate-pulse space-y-4">
              <div className="w-32 h-6 bg-stone-300 rounded" />
              <div className="space-y-2">
                <div className="w-full h-3 bg-stone-200 rounded" />
                <div className="w-full h-3 bg-stone-200 rounded" />
              </div>
              <div className="h-12 bg-stone-300 rounded-xl mt-4" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
