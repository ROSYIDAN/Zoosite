"use client";

import BreadcrumbLink from "@/components/breadcrumbs/BreadcrumbLink";
import ImageWithSkeleton from "@/components/loading/ImageWithSkeleton";

interface Region {
  id: string;
  region_name: string;
  image_url?: string;
  top_habitat?: string;
  animal_count?: number;
}

export default function RegionCardGrid({ regions }: { regions: Region[] }) {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {regions.map((r) => (
        <BreadcrumbLink
          key={r.id}
          href={`/regions/${encodeURIComponent(r.region_name || '')}?count=${r.animal_count || 0}`}
          breadcrumbLabel="Regions"
          className="group relative bg-surface-container-low rounded-[2rem] overflow-hidden transition-all duration-300 hover:translate-y-[-4px] block"
        >
          <div className="h-64 overflow-hidden relative">
            <ImageWithSkeleton
              alt={r.region_name || "Region image"}
              src={r.image_url || "https://images.unsplash.com/photo-1542224566-6f345c602073?q=80&w=2564&auto=format&fit=crop"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              containerClassName="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-60"></div>
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-surface-container-lowest/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-3xl">public</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold font-headline text-primary mb-1">{r.region_name}</h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-tertiary">{r.top_habitat || "Diverse Ecosystem"}</p>
              </div>
              <div className="bg-primary-fixed/30 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-primary">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-outline-variant/20">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">{r.animal_count || 0}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Documented Species</span>
              </div>
              <button className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center group-hover:bg-primary-container transition-colors shadow-lg">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </BreadcrumbLink>
      ))}

      {/* Add Region Card Placeholder */}
      <div className="group relative border-2 border-dashed border-outline-variant rounded-[2rem] flex flex-col items-center justify-center p-12 text-center transition-all duration-300 hover:bg-surface-container-high hover:border-primary/40 cursor-default">
        <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-4xl">add_location</span>
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">Propose New Region</h3>
        <p className="text-on-surface-variant text-sm max-w-[200px]">Submit geographic data for a new field research zone.</p>
      </div>
    </div>
  );
}
