import React from "react";
import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1440px] mx-auto">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8 w-48 h-6 bg-surface-container-high rounded animate-pulse" />
        
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="w-1/4 h-10 bg-surface-container-high rounded animate-pulse mb-3" />
          <div className="w-1/3 h-4 bg-surface-container-high rounded animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
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
      </div>
    </DashboardLayout>
  );
}