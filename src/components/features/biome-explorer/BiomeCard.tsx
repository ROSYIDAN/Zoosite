import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import BreadcrumbLink from "@/components/breadcrumbs/BreadcrumbLink";
import ImageWithSkeleton from "@/components/loading/ImageWithSkeleton";
import type { BiomeData, BiomeTheme } from "@/types/biome.types";

interface BiomeCardProps {
  biome: BiomeData;
  theme: BiomeTheme;
  priority?: boolean;
}

export default function BiomeCard({ biome, theme, priority = false }: BiomeCardProps) {
  const visibleHabitats = biome.habitats.slice(0, 3);
  const remainingCount = biome.habitats.length - 3;

  return (
    <article
      id={biome.id}
      className="bg-white dark:bg-[#232621] rounded-3xl overflow-hidden border border-[#1a1c19]/8 dark:border-[#2d5a27]/10 flex flex-col hover:shadow-lg transition-all duration-300 scroll-mt-24 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.02)]"
    >
      {/* Banner Cover Image */}
      <div className="h-44 relative overflow-hidden bg-stone-100 dark:bg-stone-900">
        <ImageWithSkeleton
          alt={biome.title}
          src={biome.imageSrc}
          priority={priority}
          className="w-full h-full object-cover"
          containerClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"></div>

        {/* Floating Icon and Title info */}
        <div className="absolute bottom-4 left-6 flex items-center gap-3">
          <div className={cn("p-2 rounded-2xl text-white flex items-center justify-center shadow-md", theme.iconBg)}>
            <span className="material-symbols-outlined text-[24px]">
              {biome.icon}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight font-headline">
            {biome.title}
          </h2>
        </div>
      </div>

      {/* Card Content details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div>
          {/* Animal Count label */}
          <div className="flex items-baseline gap-1 mb-4 font-['Plus_Jakarta_Sans']">
            <span className="text-3xl font-extrabold text-primary dark:text-[#d0e8c5]">
              {biome.animalCount}
            </span>
            <span className="text-sm font-medium text-[#1a1c19]/50 dark:text-[#fafaf5]/50">
              species cataloged
            </span>
          </div>

          {/* Fine-grained habitat tags (max 3, plus remaining count) */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#1a1c19]/40 dark:text-[#fafaf5]/40 font-['Plus_Jakarta_Sans']">
              Habitat Examples
            </p>
            <div className="flex flex-wrap gap-2">
              {visibleHabitats.map((hab) => (
                <BreadcrumbLink
                  key={hab.id}
                  href={`/habitats/${encodeURIComponent(hab.name)}`}
                  breadcrumbLabel="Biome Explorer"
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors font-['Manrope']",
                    theme.tagClass
                  )}
                >
                  {hab.name}
                </BreadcrumbLink>
              ))}
              {remainingCount > 0 && (
                <Link
                  href={`/habitats?biome=${biome.id}`}
                  className={cn(
                    "px-2.5 py-1 text-xs font-bold rounded-md border transition-colors font-['Manrope'] flex items-center gap-1",
                    theme.tagClass
                  )}
                >
                  +{remainingCount} more
                  <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </Link>
              )}
              {biome.habitats.length === 0 && (
                <span className="text-xs text-[#1a1c19]/40 dark:text-[#fafaf5]/40 italic">
                  No sub-habitats listed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Featured animals list */}
        <div className="space-y-4 pt-4 border-t border-[#1a1c19]/5 dark:border-[#2d5a27]/10">
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#1a1c19]/40 dark:text-[#fafaf5]/40 font-['Plus_Jakarta_Sans']">
              Featured Wildlife
            </p>
            <div className="flex items-center gap-4">
              {biome.featuredAnimals.map((animal) => (
                <Link
                  key={animal.slug}
                  href={`/animals/${animal.slug}`}
                  className="group/item flex flex-col items-center text-center max-w-[80px]"
                  title={`View ${animal.name}`}
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-[#1a1c19]/10 dark:border-white/10 shadow-sm relative transition-all duration-300 group-hover/item:scale-105 group-hover/item:border-primary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={animal.name}
                      src={animal.image}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-medium text-[#1a1c19]/70 dark:text-[#fafaf5]/70 truncate w-full mt-1 group-hover/item:text-primary transition-colors font-['Manrope']">
                    {animal.name}
                  </span>
                </Link>
              ))}
              {biome.featuredAnimals.length === 0 && (
                <span className="text-xs text-[#1a1c19]/40 dark:text-[#fafaf5]/40 italic font-['Manrope']">
                  No species available
                </span>
              )}
            </div>
          </div>

          {/* Biome badge */}
          <div className="pt-2">
            <div
              className={cn(
                "rounded-full py-1.5 px-4 flex items-center justify-center gap-2",
                theme.badgeBg
              )}
            >
              <span className="material-symbols-outlined text-[16px] text-primary">
                stars
              </span>
              <span className={cn("text-[11px] font-bold tracking-tight font-['Plus_Jakarta_Sans']", theme.badgeText)}>
                {biome.badge}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
