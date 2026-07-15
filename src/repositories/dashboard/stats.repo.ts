import { prisma } from "@/lib/prisma";

export const statsRepo = {
  async countAnimalsLivedByRegion(regionName: string) {
    return prisma.animals.count({
      where: {
        is_visible: true,
        animal_distributions: {
          some: {
            countries: {
              regions: {
                region: { equals: regionName, mode: "insensitive" },
              },
            },
          },
        },
      },
    });
  },

  async countAnimalsLivedByHabitat(habitatName: string) {
    return prisma.animals.count({
      where: {
        is_visible: true,
        animal_environment: {
          some: {
            habitat: {
              habitat_name: { equals: habitatName, mode: "insensitive" },
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
};