import { buildLocalImageUrl } from "../image-utils";

// ── Types for raw Prisma select results ──

type RawBrowseRegion = {
  id: string;
  region_name: string;
  image_url: string | null;
  animal_count: number;
  top_habitat: string | null;
};

type RawBrowseHabitat = {
  habitat_name: string | null;
};

type RawExploreAnimal = {
  id: string;
  animal_name: string | null;
  scientific_name: string | null;
  canonical_slug: string | null;
  animal_images: { image_url: string | null }[];
  animal_environment: { habitat: { habitat_name: string | null } | null }[];
};

type RawTrendingAnimal = {
  id: string;
  ordo: string | null;
  animal_name: string | null;
  scientific_name: string | null;
  canonical_slug: string | null;
  animal_images: { image_url: string | null }[];
  animal_environment: { habitat: { habitat_name: string | null } | null }[];
  dataset_animals?: {
    height_cm: string | null;
    weight_kg: string | null;
    lifespan_years: string | null;
    diet: string | null;
    avg_speed_kmh: string | null;
    conservation_status: string | null;
  }[];
};

// ── Mappers ──

export function toBrowseRegionItem(raw: RawBrowseRegion) {
  return {
    id: raw.id,
    region_name: raw.region_name,
    image_url: raw.image_url,
    animal_count: raw.animal_count,
    top_habitat: raw.top_habitat,
  };
}

export function toBrowseHabitatItem(raw: RawBrowseHabitat) {
  return {
    habitat: raw.habitat_name,
  };
}

export function toExploreAnimalItem(raw: RawExploreAnimal, regionContext?: string) {
  const imgbbUrl = raw.animal_images?.find(img => img.image_url?.includes("ibb.co"))?.image_url;
  return {
    id: raw.id,
    name: raw.animal_name || "Unknown",
    imageUrl: imgbbUrl || buildLocalImageUrl(raw.canonical_slug),
    habitats: raw.animal_environment
      .map((env) => env.habitat?.habitat_name)
      .filter(Boolean),
    region: regionContext,
  };
}

export function toTrendingAnimalItem(raw: RawTrendingAnimal, detail: string | undefined) {
  const imgbbUrl = raw.animal_images?.find(img => img.image_url?.includes("ibb.co"))?.image_url;
  const baseResult: any = {
    id: raw.id,
    slug: raw.canonical_slug,
    name: raw.animal_name || "Unknown",
    habitats: raw.animal_environment
      .map((env) => env.habitat?.habitat_name)
      .filter(Boolean),
    ordo: raw.ordo,
    imageUrl: imgbbUrl || buildLocalImageUrl(raw.canonical_slug),
  };

  if (detail === "full" && raw.dataset_animals && raw.dataset_animals.length > 0) {
    const rawStats = raw.dataset_animals[0];
    baseResult.stats = {
      height_cm: rawStats.height_cm,
      weight_kg: rawStats.weight_kg,
      lifespan_years: rawStats.lifespan_years,
      diet: rawStats.diet,
      avg_speed_kmh: rawStats.avg_speed_kmh,
      conservation_status: rawStats.conservation_status,
    };
  }

  return baseResult;
}
