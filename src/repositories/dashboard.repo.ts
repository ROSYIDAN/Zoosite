import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dashboardRepo = {
  // ── Browse ──

  async getRegionsBrowse() {
    return prisma.$queryRawUnsafe<any[]>(`
      SELECT 
          r.id, 
          r.region as region_name,
          r.imageurl as image_url,
          (
              SELECT COUNT(DISTINCT ad.animal_id)
              FROM countries c
              JOIN animal_distributions ad ON ad.country_id = c.id
              JOIN animals a ON ad.animal_id = a.id
              WHERE c.region_id = r.id AND a.is_visible = true
          )::int as animal_count,
          (
              SELECT h.habitat_name
              FROM countries c
              JOIN animal_distributions ad ON ad.country_id = c.id
              JOIN animal_environment ae ON ae.animal_id = ad.animal_id
              JOIN habitat h ON h.id = ae.habitat_id
              JOIN animals a ON ad.animal_id = a.id
              WHERE c.region_id = r.id AND a.is_visible = true
              GROUP BY h.habitat_name
              ORDER BY COUNT(DISTINCT ad.animal_id) DESC
              LIMIT 1
          ) as top_habitat
      FROM regions r
      WHERE r.region IS NOT NULL
      ORDER BY r.region ASC
    `);
  },

  async getHabitatsBrowse() {
    return prisma.habitat.findMany({
      select: { habitat_name: true },
      where: { habitat_name: { not: null } },
      orderBy: { habitat_name: "asc" },
    });
  },

  // ── Dynamic / Classes ──

  async getAnimalClasses() {
    return prisma.animal_class.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  },

  async countAnimalsByClass(classId: string) {
    return prisma.animals.count({
      where: { class_id: classId, is_visible: true },
    });
  },

  // ── Explore ──

  async getAnimalsByHabitat(habitat: string) {
    return prisma.animals.findMany({
      where: {
        is_visible: true,
        animal_environment: {
          some: {
            habitat: {
              habitat_name: { equals: habitat, mode: "insensitive" },
            },
          },
        },
      },
      select: {
        id: true,
        animal_name: true,
        scientific_name: true,
        canonical_slug: true,
        animal_images: {
          select: { image_url: true },
        },
        animal_environment: {
          select: { habitat: { select: { habitat_name: true } } },
        },
      },
    });
  },

  async getAnimalsByRegion(region: string) {
    return prisma.animals.findMany({
      where: {
        is_visible: true,
        animal_distributions: {
          some: {
            countries: {
              regions: {
                region: { equals: region, mode: "insensitive" },
              },
            },
          },
        },
      },
      select: {
        id: true,
        animal_name: true,
        scientific_name: true,
        canonical_slug: true,
        animal_images: {
          select: { image_url: true },
        },
        animal_environment: {
          select: { habitat: { select: { habitat_name: true } } },
        },
      },
    });
  },

  // ── Stats ──

  async countAnimalsLivedByRegion(region: string) {
    return prisma.animals.count({
      where: {
        is_visible: true,
        animal_distributions: {
          some: {
            countries: {
              regions: {
                region: { equals: region, mode: "insensitive" },
              },
            },
          },
        },
      },
    });
  },

  async countAnimalsLivedByHabitat(habitat: string) {
    return prisma.animals.count({
      where: {
        is_visible: true,
        animal_environment: {
          some: {
            habitat: {
              habitat_name: { equals: habitat, mode: "insensitive" },
            },
          },
        },
      },
    });
  },

  async getTotals() {
    const fullDataAnimalsCount = await prisma.dataset_animals.count();
    const totalRegions = await prisma.regions.count();
    const totalCountries = await prisma.countries.count();

    return { fullDataAnimalsCount, totalRegions, totalCountries };
  },

  // ── Trending ──

  async getRandomAnimalIds(limit: number) {
    return prisma.$queryRaw<{ id: string }[]>(
      Prisma.sql`SELECT id FROM animals WHERE is_visible = true ORDER BY random() LIMIT ${limit}`
    );
  },

  async getAnimalsWithImages(idList: string[]) {
    return prisma.animals.findMany({
      where: { id: { in: idList }, is_visible: true },
      select: {
        id: true,
        animal_images: {
          select: { image_url: true }
        }
      }
    });
  },

  async getTrendingAnimals(idList: string[], detail?: string) {
    const selectConfig: Prisma.animalsSelect = {
      id: true,
      ordo: true,
      animal_name: true,
      scientific_name: true,
      canonical_slug: true,
      animal_images: {
        select: { image_url: true },
      },
      animal_environment: {
        select: { habitat: { select: { habitat_name: true } } },
      },
    };

    if (detail === "full") {
      selectConfig.dataset_animals = {
        select: {
          height_cm: true,
          weight_kg: true,
          lifespan_years: true,
          diet: true,
          avg_speed_kmh: true,
          conservation_status: true,
        },
      };
    }

    return prisma.animals.findMany({
      where: { id: { in: idList }, is_visible: true },
      select: selectConfig,
    });
  },
};
