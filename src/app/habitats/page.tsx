import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";
import NavigationBreadcrumbs from "@/components/breadcrumbs/NavigationBreadcrumbs";
import BreadcrumbLink from "@/components/breadcrumbs/BreadcrumbLink";
import ImageWithSkeleton from "@/components/loading/ImageWithSkeleton";
import { getBiomeExplorerData } from "@/lib/biome-mapper";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Biome Explorer | Arboreal Archive",
  description: "Explore broad biome categories, habitat examples, and featured wildlife across the animal archive.",
};

const BIOME_UI_THEMES: Record<
  string,
  {
    iconBg: string;
    badgeBg: string;
    badgeText: string;
    tagClass: string;
  }
> = {
  forests: {
    iconBg: "bg-[#2d5a27] dark:bg-[#3d7a35]",
    badgeBg: "bg-[#2d5a27]/10 dark:bg-[#3d7a35]/20",
    badgeText: "text-[#2d5a27] dark:text-[#d0e8c5]",
    tagClass: "bg-[#2d5a27]/5 text-[#2d5a27] border-[#2d5a27]/10 hover:bg-[#2d5a27]/10 dark:text-[#d0e8c5] dark:border-[#3d7a35]/30",
  },
  grasslands: {
    iconBg: "bg-amber-600 dark:bg-amber-700",
    badgeBg: "bg-amber-50 dark:bg-amber-950/20",
    badgeText: "text-amber-800 dark:text-amber-300",
    tagClass: "bg-amber-50 dark:bg-amber-950/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30 hover:bg-amber-100/50",
  },
  wetlands: {
    iconBg: "bg-teal-600 dark:bg-teal-700",
    badgeBg: "bg-teal-50 dark:bg-teal-950/20",
    badgeText: "text-teal-800 dark:text-teal-300",
    tagClass: "bg-teal-50 dark:bg-teal-950/10 text-teal-700 dark:text-teal-400 border-teal-100 dark:border-teal-900/30 hover:bg-teal-100/50",
  },
  waters: {
    iconBg: "bg-blue-600 dark:bg-blue-700",
    badgeBg: "bg-blue-50 dark:bg-blue-950/20",
    badgeText: "text-blue-800 dark:text-blue-300",
    tagClass: "bg-blue-50 dark:bg-blue-950/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30 hover:bg-blue-100/50",
  },
  "deserts-drylands": {
    iconBg: "bg-orange-600 dark:bg-orange-700",
    badgeBg: "bg-orange-50 dark:bg-orange-950/20",
    badgeText: "text-orange-800 dark:text-orange-300",
    tagClass: "bg-orange-50 dark:bg-orange-950/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-900/30 hover:bg-orange-100/50",
  },
  "polar-tundra": {
    iconBg: "bg-sky-600 dark:bg-sky-700",
    badgeBg: "bg-sky-50 dark:bg-sky-950/20",
    badgeText: "text-sky-800 dark:text-sky-300",
    tagClass: "bg-sky-50 dark:bg-sky-950/10 text-sky-700 dark:text-sky-400 border-sky-100 dark:border-sky-900/30 hover:bg-sky-100/50",
  },
  "mountains-highlands": {
    iconBg: "bg-stone-600 dark:bg-stone-700",
    badgeBg: "bg-stone-100 dark:bg-stone-900/20",
    badgeText: "text-stone-800 dark:text-stone-300",
    tagClass: "bg-stone-100 dark:bg-stone-900/10 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-800/30 hover:bg-stone-200/50",
  },
};

interface PageProps {
  searchParams: Promise<{ biome?: string }>;
}

export default async function HabitatsPage({ searchParams }: PageProps) {
  const { biome: activeBiomeId } = await searchParams;
  const biomes = await getBiomeExplorerData();

  // ── FILTERED BIOME VIEW ──
  if (activeBiomeId) {
    const activeBiome = biomes.find((b) => b.id === activeBiomeId);
    if (!activeBiome) {
      notFound();
    }

    const theme = BIOME_UI_THEMES[activeBiome.id] || BIOME_UI_THEMES.forests;
    const habitatIds = activeBiome.habitats.map((h) => h.id);

    // Fetch fine-grained habitats inside this biome along with their species counts
    const habitatsWithCounts = await prisma.habitat.findMany({
      where: {
        id: { in: habitatIds },
      },
      select: {
        id: true,
        habitat_name: true,
        _count: {
          select: {
            animal_environment: {
              where: {
                animals: {
                  is_visible: true
                }
              }
            }
          },
        },
      },
      orderBy: {
        habitat_name: "asc",
      },
    });

    return (
      <DashboardLayout>
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
      </DashboardLayout>
    );
  }

  // ── CORE BIOMES GRID VIEW ──
  return (
    <DashboardLayout>
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
            const theme = BIOME_UI_THEMES[biome.id] || BIOME_UI_THEMES.forests;
            const visibleHabitats = biome.habitats.slice(0, 3);
            const remainingCount = biome.habitats.length - 3;

            return (
              <article
                key={biome.id}
                id={biome.id}
                className="bg-white dark:bg-[#232621] rounded-3xl overflow-hidden border border-[#1a1c19]/8 dark:border-[#2d5a27]/10 flex flex-col hover:shadow-lg transition-all duration-300 scroll-mt-24 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.02)]"
              >
                {/* Banner Cover Image */}
                <div className="h-44 relative overflow-hidden bg-stone-100 dark:bg-stone-900">
                  <ImageWithSkeleton
                    alt={biome.title}
                    src={biome.imageSrc}
                    priority={index < 3}
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
    </DashboardLayout>
  );
}
