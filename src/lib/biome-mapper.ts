import { prisma } from "@/lib/prisma";
import { buildLocalImageUrl } from "@/lib/image-utils";

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
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDadjWTOMfguD_tfs48aC-NRDHcb4ytEPynocRlNKVLaz3FWfVekQuBUrIHZQ9v8alT0hm7j3GyRV-SbZKZl_XYb6tXt3qd-97wVi5m1RpQUqjKe1-ltE0R7tnVWSDsD7_EpruioTn911SIs9rY9AJW-yAl7ATjlO92cfMIJb8r0cXhEfL6oBrCpi_Dtsx7TW456Ym6sCwXQQif6Ax2zKHZmNyAPSg8-axG2pq0z2-EJI6GQUXf4PI2HvsuxEtOPnol8XVwIaMzb74",
    icon: "forest",
    badge: "Dense canopy species",
    keywords: ["forest", "woodland", "jungle", "rainforest", "canopy"]
  },
  {
    id: "grasslands",
    title: "Grasslands",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ1xb_JQMugjeQiob9reIJU-eTRqsuYiOxjunJ3gHdug7zSxbZwqPVv84vzyIvRR2CcRhuJi6MJSnI66zi2a0_45sb_yCYuuWabW1tUtnqlGBV2yAILkk_AioUfSNlI70MAOv3q37SU9e3rAeMT6x9ffnSlJv_FXHQCxJFK22zBC1H8SWIjdIkAsdAqrRUDFRETHjnFwl8l9gc2c8o199JlSZPeUE2PFW60FfL9gJlhZpQPSHnmCNQJgJmhgkpUPt9xmap0Fj4nus",
    icon: "grass",
    badge: "Open-range life",
    keywords: ["savanna", "prairie", "steppe", "meadow", "plains", "grassland"]
  },
  {
    id: "wetlands-waters",
    title: "Wetlands & Waters",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6BdToWbtZrZ-jAnOQhhLAqlLHT3UF2zyWo2AyQNm2XCmo3YVcb74p77xnwo0jfeWyZv2OzijlAYv0u6uhkYtZN1noIjkn9c8-uUPGluFExvOBl8EMqBS52M_rwKu-o7MPyfPX4m613PVdAWvlYV5h-XQ64X8pgGoNmBs0nnJgbP_KJlTmAZAJ_l4yPtQ382YDL32PUkNryqTFtnQ5uPnc7KivNb9rW91d5ds3NZsYPuyoxyOl097KF-_lz9DaCJcs7yEi8wY0jAc",
    icon: "water",
    badge: "Aquatic & semi-aquatic life",
    keywords: ["swamp", "marsh", "river", "lake", "mangrove", "coast", "ocean", "reef", "marine", "freshwater", "water", "shore", "sea", "wetland", "coastal"]
  },
  {
    id: "deserts-drylands",
    title: "Deserts & Drylands",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBU2lhd6d63ZL5hLL2-ngN1FqzPSkVo_pK8QvwWAkaF1h3yfo_EuIUeYGil-MB4yNa2Bwdzj3MeFzBHjlcIqA84ez5U400cxfxPhmq9m9wGcVQnNrQHhh--j5YgyHwiNxCTuUhFkxZPUjMbsfL2wSG482lKSoMaQOxiyAAh2nc0-iSWl1Y5PtwpDzkitZgG3yXs8GJ5R8qSXahBJg5PsEvRcMMFGnpX4x03GVaGCRjggd5xXDdB8A0F-p-BwLp4HbclSo3u2l48o18",
    icon: "wb_sunny",
    badge: "Heat-adapted survivalists",
    keywords: ["desert", "scrubland", "arid", "dry", "semi-arid"]
  },
  {
    id: "polar-tundra",
    title: "Polar & Tundra",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLxP2iQKTKfBFPHJGFvREaYpyzsmd9h3MvQP4Onz_ngMNpJFZRYiYiPaFlpHc-1CmdP1vVmKDM1lygIWaXa5fYlosnYdxEJ8t0c9RhtzTPiShRr0p9v6qLZ8QdJ9_jcCRCBzo--8sHtkVDqCbQ24B81KsBTHT2k5CwTBi25SavohRI8TreMAsTytM_HS6v32gGCE2Q6DvVzXzH2_FLX9gVL16ftMQ_R45_Zy49_r2wcuTy8raOUloeWdFhjsFzRHNUhbPnrnQRkYM",
    icon: "ac_unit",
    badge: "Cold-adapted species",
    keywords: ["polar", "tundra", "ice", "arctic", "antarctic", "cold", "glacier"]
  },
  {
    id: "mountains-highlands",
    title: "Mountains & Highlands",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_n3ZXYb8kg2-ubo32fpKrktkMIXqOjZ2NkRjMKd03U81szS2iCYPDWMz0oAtKcym6aCb0wjP6Xh9obNhe_m8VIQG0yEk8IiaFqNrWtlaLtc2l4-FC5ibH4Dufw-YvFzzh7ArWwANlFmEJrAMUJ0d7pAtDJCAgLVxpOFq9cDiifnWiUSe3qed3OiiKP5gw2GXLGggqC_M50ew7Fb1T8IpuDLk0M6xOaUf-DlyXemz6l4UcTUvOyxsN-d3__R71zpcY17_bE8jrhMU",
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
        if (env.animals) {
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
      
      const imgbbUrl = animal.animal_images?.find((img: any) => img.image_url?.includes("ibb.co"))?.image_url;
      const imageUrl = imgbbUrl || buildLocalImageUrl(animal.canonical_slug) || animal.animal_images?.[0]?.image_url;
      
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
