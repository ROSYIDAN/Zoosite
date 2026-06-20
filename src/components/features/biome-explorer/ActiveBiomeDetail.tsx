import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import BreadcrumbLink from "@/components/breadcrumbs/BreadcrumbLink";
import type { BiomeData, BiomeTheme } from "@/types/biome.types";

interface HabitatWithCount {
  id: string;
  habitat_name: string | null;
  _count: {
    animal_environment: number;
  };
}

interface ActiveBiomeDetailProps {
  activeBiome: BiomeData;
  theme: BiomeTheme;
  habitatsWithCounts: HabitatWithCount[];
}

export default function ActiveBiomeDetail({
  activeBiome,
  theme,
  habitatsWithCounts,
}: ActiveBiomeDetailProps) {
  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">
      {/* Breadcrumbs & Title header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center text-sm font-medium text-on-surface-variant bg-surface-container/50 px-4 py-2 rounded-xl w-fit border border-outline-variant/10">
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span className="material-symbols-outlined text-sm mx-2 opacity-40 select-none">
            chevron_right
          </span>
          <Link href="/habitats" className="hover:text-primary transition-colors">
            Biome Explorer
          </Link>
          <span className="material-symbols-outlined text-sm mx-2 opacity-40 select-none">
            chevron_right
          </span>
          <span className="text-primary font-bold">{activeBiome.title}</span>
        </div>

        <div className="p-6 bg-white/40 dark:bg-[#232621]/40 rounded-r-3xl rounded-l-lg border border-[#1a1c19]/5 dark:border-white/5 border-l-4 border-l-primary dark:border-l-[#d0e8c5] backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex items-center gap-5">
          <div className={cn("p-3 rounded-2xl text-white flex items-center justify-center shadow-md shrink-0", theme.iconBg)}>
            <span className="material-symbols-outlined text-[28px]">
              {activeBiome.icon}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary dark:text-[#d0e8c5] font-headline">
              {activeBiome.title} Habitats
            </h1>
            <p className="text-sm text-[#1a1c19]/85 dark:text-[#fafaf5]/85 mt-1 max-w-2xl font-['Manrope'] leading-relaxed">
              Explore all documented micro-environments under the {activeBiome.title.toLowerCase()} biome.
            </p>
          </div>
        </div>
      </div>

      {/* Sibling habitats list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habitatsWithCounts.map((h) => (
          <BreadcrumbLink
            key={h.id}
            href={`/habitats/${encodeURIComponent(h.habitat_name || "")}`}
            breadcrumbLabel={activeBiome.title}
            className="p-6 bg-white dark:bg-[#232621] rounded-3xl hover:bg-[#2d5a27]/5 dark:hover:bg-[#2d5a27]/10 transition-all border border-[#1a1c19]/8 dark:border-[#2d5a27]/10 group block hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-primary dark:text-[#d0e8c5] group-hover:underline lowercase capitalize leading-tight">
                  {h.habitat_name}
                </h2>
                <p className="text-xs text-[#1a1c19]/50 dark:text-[#fafaf5]/50 mt-2 font-['Manrope']">
                  {h._count.animal_environment} species documented
                </p>
              </div>
              <span className="material-symbols-outlined text-primary opacity-30 group-hover:opacity-100 transition-opacity">
                {activeBiome.icon}
              </span>
            </div>
          </BreadcrumbLink>
        ))}
      </div>

      {/* Back navigation links */}
      <div className="pt-4 flex items-center gap-6">
        <Link
          href="/habitats"
          className="text-primary hover:underline flex items-center gap-2 font-medium font-['Manrope'] text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Biome Explorer
        </Link>
      </div>
    </div>
  );
}
