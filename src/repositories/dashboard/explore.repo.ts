import { prisma } from "@/lib/prisma";

export const exploreRepo = {
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
};