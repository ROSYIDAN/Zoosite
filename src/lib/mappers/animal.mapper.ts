import { buildLocalImageUrl } from "../image-utils";

// ── Types for raw Prisma select results ──

type RawAnimalDetail = {
  id: string;
  canonical_slug: string | null;
  animal_name: string | null;
  scientific_name: string | null;
  family: string | null;
  genus: string | null;
  ordo: string | null;
  is_visible?: boolean;
  animal_images: { image_url: string | null }[];
  animal_descriptions: {
    summary: string;
    source: string | null;
    source_url: string | null;
  }[];
  animal_environment: {
    habitat: { habitat_name: string | null } | null;
  }[];
  dataset_animals: {
    height_cm: string | null;
    weight_kg: string | null;
    lifespan_years: string | null;
    diet: string | null;
    predators: string | null;
    avg_speed_kmh: string | null;
    top_speed_kmh: string | null;
    social_structure: string | null;
    offspring_per_birth: string | null;
    gestation_days: string | null;
    color: string | null;
    conservation_status: string | null;
  }[];
  animal_distributions: {
    countries: {
      country: string;
      country_flag: string | null;
      regions: { region: string | null } | null;
    } | null;
  }[];
};

type RawAnimalListItem = {
  id: string;
  canonical_slug: string | null;
  animal_name: string | null;
  scientific_name: string | null;
  family: string | null;
  genus: string | null;
  ordo: string | null;
  created_at: Date | null;
  is_visible?: boolean;
  animal_images: { image_url: string | null }[];
};

type RawCreatedAnimal = {
  id: string;
  canonical_slug: string | null;
  family: string | null;
  genus: string | null;
  created_at: Date | null;
};

// ── Mappers ──

/**
 * Maps the raw Prisma detail result to a clean, nested API response shape.
 */
export function toAnimalDetail(raw: RawAnimalDetail) {
  const imgbbUrl = raw.animal_images?.find(img => img.image_url?.includes("ibb.co"))?.image_url;
  const imageUrl = imgbbUrl || buildLocalImageUrl(raw.canonical_slug);

  return {
    id: raw.id,
    slug: raw.canonical_slug,
    name: raw.animal_name,
    scientific_name: raw.scientific_name,
    is_visible: raw.is_visible ?? true,

    taxonomy: {
      family: raw.family,
      genus: raw.genus,
      order: raw.ordo,
    },

    descriptions: raw.animal_descriptions.map((d) => ({
      summary: d.summary,
      source: d.source,
      source_url: d.source_url,
    })),

    habitats: raw.animal_environment
      .map((e) => e.habitat?.habitat_name)
      .filter(Boolean),

    distribution: raw.animal_distributions.map((d) => ({
      country: d.countries?.country,
      region: d.countries?.regions?.region,
      flag: d.countries?.country_flag || null,
    })),

    images: [imageUrl].filter(Boolean) as string[],

    stats: (() => {
      if (raw.dataset_animals.length === 0) return null;
      const s = raw.dataset_animals[0];
      return {
        height_cm: s.height_cm,
        weight_kg: s.weight_kg,
        lifespan_years: s.lifespan_years,
        diet: s.diet,
        predators: s.predators
          ? s.predators.split(",").map((p: string) => p.trim())
          : [],
        avg_speed_kmh: s.avg_speed_kmh,
        top_speed_kmh: s.top_speed_kmh,
        social_structure: s.social_structure,
        offspring_per_birth: s.offspring_per_birth,
        gestation_days: s.gestation_days,
        color: s.color,
        conservation_status: s.conservation_status,
      };
    })(),
  };
}

/**
 * Maps a list-query result to a concise list item.
 */
export function toAnimalListItem(raw: RawAnimalListItem) {
  const imgbbUrl = raw.animal_images?.find(img => img.image_url?.includes("ibb.co"))?.image_url;
  return {
    id: raw.id,
    slug: raw.canonical_slug,
    name: raw.animal_name,
    scientific_name: raw.scientific_name,
    family: raw.family,
    image: imgbbUrl || buildLocalImageUrl(raw.canonical_slug),
    is_visible: raw.is_visible ?? true,
  };
}

/**
 * Maps the created animal result.
 */
export function toCreatedAnimal(raw: RawCreatedAnimal) {
  return {
    id: raw.id,
    slug: raw.canonical_slug,
    family: raw.family,
    genus: raw.genus,
    created_at: raw.created_at,
  };
}
