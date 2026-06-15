import { prisma } from "@/lib/prisma";
import { getPreferredAnimalImageUrl } from "@/lib/image-utils";

export interface FeaturedAnimal {
  name: string;
  slug: string;
  image: string;
}

export interface BiomeData {
  id: string;
  title: string;
  imageSrc: string;
  icon: string;
  badge: string;
  animalCount: number;
  habitats: { id: string; name: string }[];
  featuredAnimals: FeaturedAnimal[];
}

export const BIOMES = [
  {
    id: "forests",
    title: "Forests",
    imageSrc: "/biomes/forests.png",
    icon: "forest",
    badge: "Dense canopy species",
    keywords: ["forest", "woodland", "jungle", "rainforest", "canopy"]
  },
  {
    id: "grasslands",
    title: "Grasslands",
    imageSrc: "/biomes/grasslands.png",
    icon: "grass",
    badge: "Open-range life",
    keywords: ["savanna", "prairie", "steppe", "meadow", "plains", "grassland"]
  },
  {
    id: "wetlands",
    title: "Wetlands",
    imageSrc: "/biomes/wetlands.png",
    icon: "waves",
    badge: "Swamp & marshland species",
    keywords: ["swamp", "marsh", "mangrove", "wetland", "bog", "floodplain", "peatland"]
  },
  {
    id: "waters",
    title: "Waters",
    imageSrc: "/biomes/waters.png",
    icon: "water",
    badge: "Aquatic & marine life",
    keywords: ["river", "lake", "ocean", "reef", "marine", "freshwater", "water", "sea", "coast", "coastal", "shore", "estuary", "pelagic", "deep-sea", "bay", "fjord", "pond", "stream", "channel"]
  },
  {
    id: "deserts-drylands",
    title: "Deserts & Drylands",
    imageSrc: "/biomes/deserts-drylands.png",
    icon: "wb_sunny",
    badge: "Heat-adapted survivalists",
    keywords: ["desert", "scrubland", "arid", "dry", "semi-arid"]
  },
  {
    id: "polar-tundra",
    title: "Polar & Tundra",
    imageSrc: "/biomes/polar-tundra.png",
    icon: "ac_unit",
    badge: "Cold-adapted species",
    keywords: ["polar", "tundra", "ice", "arctic", "antarctic", "cold", "glacier"]
  },
  {
    id: "mountains-highlands",
    title: "Mountains & Highlands",
    imageSrc: "/biomes/mountains-highlands.png",
    icon: "terrain",
    badge: "High-altitude specialists",
    keywords: ["alpine", "cliff", "slope", "mountain", "highland", "rocky", "altitude", "mountains", "hills"]
  }
];

export async function getBiomeExplorerData(): Promise<BiomeData[]> {
  const habitats = await prisma.habitat.findMany({
    where: {
      habitat_name: { not: null }
    },
    include: {
      animal_environment: {
        include: {
          animals: {
            select: {
              id: true,
              canonical_slug: true,
              animal_name: true,
              scientific_name: true,
              is_visible: true,
              animal_images: {
                select: { image_url: true }
              }
            }
          }
        }
      }
    }
  });

  const biomesData: BiomeData[] = BIOMES.map((b) => ({
    id: b.id,
    title: b.title,
    imageSrc: b.imageSrc,
    icon: b.icon,
    badge: b.badge,
    animalCount: 0,
    habitats: [],
    featuredAnimals: []
  }));

  // Map database habitats to biomes based on keywords
  for (const h of habitats) {
    const habitatName = h.habitat_name!;
    const normalizedName = habitatName.toLowerCase();

    let matched = false;
    for (const biome of biomesData) {
      const def = BIOMES.find((b) => b.id === biome.id)!;
      if (def.keywords.some((kw) => normalizedName.includes(kw))) {
        biome.habitats.push({ id: h.id, name: habitatName });
        matched = true;
      }
    }

    // Fallback: If a database habitat doesn't match any keyword, map it to Forests
    if (!matched) {
      const forests = biomesData.find((b) => b.id === "forests")!;
      forests.habitats.push({ id: h.id, name: habitatName });
    }
  }

  // Calculate unique animal counts & select featured animals for each biome
  for (const biome of biomesData) {
    const animalMap = new Map<string, any>();

    const biomeHabNames = new Set(biome.habitats.map((bh) => bh.name.toLowerCase()));
    const matchedHabitats = habitats.filter((h) => biomeHabNames.has(h.habitat_name!.toLowerCase()));

    for (const h of matchedHabitats) {
      for (const env of h.animal_environment) {
        if (env.animals && env.animals.is_visible !== false) {
          animalMap.set(env.animals.id, env.animals);
        }
      }
    }

    biome.animalCount = animalMap.size;

    // Select featured animals
    const allAnimals = Array.from(animalMap.values());
    const featured: FeaturedAnimal[] = [];

    for (const animal of allAnimals) {
      if (featured.length >= 3) break;

      const imageUrl = getPreferredAnimalImageUrl(animal.animal_images, animal.canonical_slug) || animal.animal_images?.[0]?.image_url;

      if (imageUrl) {
        featured.push({
          name: animal.animal_name || "Unknown",
          slug: animal.canonical_slug || "",
          image: imageUrl
        });
      }
    }

    // Fallback if needed
    if (featured.length < 3) {
      for (const animal of allAnimals) {
        if (featured.length >= 3) break;
        if (featured.some((f) => f.slug === animal.canonical_slug)) continue;

        featured.push({
          name: animal.animal_name || "Unknown",
          slug: animal.canonical_slug || "",
          image: "/images/placeholder.jpg"
        });
      }
    }

    biome.featuredAnimals = featured;
  }

  return biomesData;
}
