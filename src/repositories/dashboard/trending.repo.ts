import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const trendingRepo = {
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
          select: { image_url: true },
        },
      },
    });
  },

  async getRecentAnimals(since: Date, limit: number) {
    return prisma.animals.findMany({
      where: {
        is_visible: true,
        created_at: { gte: since },
      },
      orderBy: { created_at: "desc" },
      take: limit,
      select: {
        id: true,
        canonical_slug: true,
        animal_name: true,
        scientific_name: true,
        family: true,
        created_at: true,
        animal_images: {
          select: { image_url: true },
        },
        animal_distributions: {
          select: {
            country_id: true,
          },
        },
      },
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