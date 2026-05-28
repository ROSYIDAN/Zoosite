import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const animalDistributionRepo = {
  /**
   * Find an animal by its primary common name (case-insensitive).
   */
  async findAnimalByName(name: string) {
    return prisma.animals.findFirst({
      where: {
        animal_name: { equals: name, mode: "insensitive" },
      },
      select: { id: true, animal_name: true },
    });
  },

  /**
   * Fetch distinct countries and regions for an animal by its ID.
   */
  async getGeoDataByAnimalId(animalId: string) {
    return prisma.$queryRaw<{ country: string; region: string | null }[]>(
      Prisma.sql`
        SELECT DISTINCT c.country, r.region
        FROM animal_distributions ad
        JOIN countries c ON c.id = ad.country_id
        LEFT JOIN regions r ON r.id = c.region_id
        WHERE ad.animal_id = ${animalId}::uuid
      `
    );
  },

  /**
   * Fetch distinct habitats for an animal by its ID.
   */
  async getHabitatDataByAnimalId(animalId: string) {
    return prisma.$queryRaw<{ habitat: string }[]>(
      Prisma.sql`
        SELECT DISTINCT h.habitat_name as habitat
        FROM animal_environment ae
        JOIN habitat h ON h.id = ae.habitat_id
        WHERE ae.animal_id = ${animalId}::uuid
          AND h.habitat_name IS NOT NULL
      `
    );
  },
};
