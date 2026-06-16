import { prisma } from "@/lib/prisma";
import type { AnimalData } from "@/types/animal";
import { buildLocalImageUrl } from "../image-utils";

/**
 * Fetches a single animal by its canonical slug, including all related data.
 * Returns null if the animal is not found.
 */
export async function getAnimalBySlug(slug: string) {
  return prisma.animals.findUnique({
    where: { canonical_slug: slug },
    include: {
      animal_descriptions: true,
      animal_images: true,
      dataset_animals: true,
      animal_environment: {
        include: {
          habitat: true
        }
      },
      animal_distributions: {
        include: {
          countries: {
            select: {
              country: true,
              country_flag: true,
              regions: true
            }
          }
        }
      },
      tags: true,
      contributor: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  });
}

/**
 * Raw animal type returned from Prisma — inferred from the query above.
 */
export type RawAnimal = NonNullable<Awaited<ReturnType<typeof getAnimalBySlug>>>;

/**
 * Maps the raw Prisma result to a clean AnimalData shape for UI components.
 */
export function mapAnimalToData(animal: RawAnimal): AnimalData {
  return {
    name: animal.animal_name,
    scientific_name: animal.scientific_name,
    taxonomy: {
      family: animal.family,
      genus: animal.genus,
      order: animal.ordo,
    },
    descriptions: animal.animal_descriptions,
    stats: (() => {
      const ds = animal.dataset_animals[0];
      if (!ds) return null;
      return {
        diet: ds.diet,
        lifespan_years: ds.lifespan_years,
        weight_kg: ds.weight_kg,
        height_cm: ds.height_cm,
        avg_speed_kmh: ds.avg_speed_kmh,
        top_speed_kmh: ds.top_speed_kmh,
        social_structure: ds.social_structure,
        conservation_status: ds.conservation_status,
        predators: ds.predators ? ds.predators.split(',').map(p => p.trim()) : []
      };
    })(),
    habitats: animal.animal_environment.map(h => h.habitat?.habitat_name),
    distribution: animal.animal_distributions.map(d => ({
      country: d.countries?.country,
      flag: d.countries?.country_flag
    })),
    images: animal.animal_images?.map(img => img.image_url).filter(Boolean) as string[] || [buildLocalImageUrl(animal.canonical_slug)],
    image_sources: animal.animal_images?.map(img => img.source) || [],
    image_photographers: animal.animal_images?.map(img => img.photographer_name) || [],
    tags: (animal.tags || []).map(t => ({ name: t.name, color: t.color }))
  };
}

/**
 * Extracts the primary common name for display.
 */
export function getCommonName(animal: RawAnimal): string {
  return animal.animal_name || "Unknown";
}

/**
 * Extracts the region name from the first distribution entry (for breadcrumbs).
 */
export function getRegionName(animal: RawAnimal): string | null | undefined {
  return animal.animal_distributions?.[0]?.countries?.regions?.region;
}
