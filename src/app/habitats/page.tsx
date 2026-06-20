import React from "react";
import { notFound } from "next/navigation";
import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";
import { getBiomeExplorerData } from "@/lib/biome-mapper";
import { habitatService } from "@/services/habitat.service";
import BiomeGrid from "@/components/features/biome-explorer/BiomeGrid";
import ActiveBiomeDetail from "@/components/features/biome-explorer/ActiveBiomeDetail";
import { BIOME_UI_THEMES } from "@/components/features/biome-explorer/theme";

export const metadata = {
  title: "Biome Explorer | Arboreal Archive",
  description: "Explore broad biome categories, habitat examples, and featured wildlife across the animal archive.",
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
    const habitatsWithCounts = await habitatService.getHabitatsWithVisibleAnimalCounts(habitatIds);

    return (
      <DashboardLayout>
        <ActiveBiomeDetail
          activeBiome={activeBiome}
          theme={theme}
          habitatsWithCounts={habitatsWithCounts}
        />
      </DashboardLayout>
    );
  }

  // ── CORE BIOMES GRID VIEW ──
  return (
    <DashboardLayout>
      <BiomeGrid biomes={biomes} themes={BIOME_UI_THEMES} />
    </DashboardLayout>
  );
}
