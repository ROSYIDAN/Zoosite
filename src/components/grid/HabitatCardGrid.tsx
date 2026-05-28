"use client";

import BreadcrumbLink from "@/components/breadcrumbs/BreadcrumbLink";

interface Habitat {
  id: string;
  habitat_name: string | null;
  _count: {
    animal_environment: number;
  };
}

export default function HabitatCardGrid({ habitats }: { habitats: Habitat[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {habitats.map((h) => (
        <BreadcrumbLink
          key={h.id}
          href={`/habitats/${encodeURIComponent(h.habitat_name || '')}`}
          breadcrumbLabel="Ecosystem Archive"
          className="p-6 bg-surface-container rounded-2xl hover:bg-surface-container-high transition-colors border border-outline-variant/10 group block"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-primary group-hover:underline lowercase capitalize">{h.habitat_name}</h2>
              <p className="text-sm text-on-surface-variant mt-2">{h._count.animal_environment} species documented</p>
            </div>
            <span className="material-symbols-outlined text-primary opacity-20 group-hover:opacity-100 transition-opacity">eco</span>
          </div>
        </BreadcrumbLink>
      ))}
    </div>
  );
}
