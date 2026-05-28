"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SkeletonGrid() {
  const searchParams = useSearchParams();
  const countParam = searchParams.get("count");
  // Default to 12 if no count is provided, but use 1 as a minimum to ensure at least one skeleton
  const count = countParam ? Math.max(1, parseInt(countParam, 10)) : 12;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10">
          {/* Image Placeholder */}
          <div className="aspect-video bg-surface-container-high animate-pulse" />
          {/* Title Placeholder */}
          <div className="p-4">
            <div className="w-2/3 h-6 bg-surface-container-highest rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <div className="p-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-8 w-48 h-6 bg-surface-container-high rounded animate-pulse" />
      
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="w-1/4 h-10 bg-surface-container-high rounded animate-pulse mb-3" />
        <div className="w-1/3 h-4 bg-surface-container-high rounded animate-pulse" />
      </div>

      {/* Grid Skeleton wrapped in Suspense so useSearchParams doesn't break static rendering */}
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10">
              <div className="aspect-video bg-surface-container-high animate-pulse" />
              <div className="p-4">
                <div className="w-2/3 h-6 bg-surface-container-highest rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      }>
        <SkeletonGrid />
      </Suspense>
    </div>
  );
}
