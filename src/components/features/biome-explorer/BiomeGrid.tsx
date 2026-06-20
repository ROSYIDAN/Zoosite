import React from "react";
import Link from "next/link";
import NavigationBreadcrumbs from "@/components/breadcrumbs/NavigationBreadcrumbs";
import BiomeCard from "./BiomeCard";
import type { BiomeData, BiomeTheme } from "@/types/biome.types";

interface BiomeGridProps {
  biomes: BiomeData[];
  themes: Record<string, BiomeTheme>;
}

export default function BiomeGrid({ biomes, themes }: BiomeGridProps) {
  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">
      {/* Breadcrumbs & Title header */}
      <div className="flex flex-col gap-4">
        <NavigationBreadcrumbs currentPageLabel="Biome Explorer" />
        <div className="p-6 bg-white/40 dark:bg-[#232621]/40 rounded-r-3xl rounded-l-lg border border-[#1a1c19]/5 dark:border-white/5 border-l-4 border-l-primary dark:border-l-[#d0e8c5] backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary dark:text-[#d0e8c5] font-headline">
            Biome Explorer
          </h1>
          <p className="text-sm text-[#1a1c19]/85 dark:text-[#fafaf5]/85 mt-2 max-w-3xl font-['Manrope'] leading-relaxed">
            Explore broad biome categories, habitat examples, and featured wildlife across the animal archive.
          </p>
        </div>
      </div>

      {/* Biome cards grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {biomes.map((biome, index) => {
          const theme = themes[biome.id] || themes.forests;
          return (
            <BiomeCard
              key={biome.id}
              biome={biome}
              theme={theme}
              priority={index < 3}
            />
          );
        })}
      </div>

      {/* Back navigation */}
      <div className="pt-4">
        <Link
          href="/dashboard"
          className="text-primary hover:underline flex items-center gap-2 font-medium font-['Manrope'] text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
