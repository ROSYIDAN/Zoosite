import { prisma } from "@/lib/prisma";
import { Prisma, DistributionStatus } from "@prisma/client";

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

  /**
   * Fetch all countries with their region names.
   */
  async getAllCountries() {
    return prisma.countries.findMany({
      select: {
        id: true,
        country: true,
        country_flag: true,
        regions: {
          select: {
            region: true,
          },
        },
      },
      orderBy: {
        country: "asc",
      },
    });
  },

  /**
   * Fetch a single country by ID.
   */
  async getCountryById(id: string) {
    return prisma.countries.findUnique({
      where: { id },
      select: {
        id: true,
        country: true,
        country_flag: true,
        regions: {
          select: {
            region: true,
          },
        },
      },
    });
  },

  /**
   * Fetch native and/or endemic animals in a country with filtering, search, and pagination.
   */
  async getNativeAnimals(
    countryId: string,
    options: {
      status?: DistributionStatus | "ALL";
      search?: string;
      limit: number;
      skip: number;
    }
  ) {
    const { status = "ALL", search, limit, skip } = options;

    // Define status filter
    // If specific status (ENDEMIC or NATIVE) is requested, filter by it.
    // Otherwise (ALL), default to either NATIVE or ENDEMIC.
    const statusFilter =
      status === "ALL"
        ? { in: [DistributionStatus.NATIVE, DistributionStatus.ENDEMIC] }
        : status;

    // Define search condition
    const searchCondition = search
      ? {
          OR: [
            { animal_name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { scientific_name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const whereClause: Prisma.animalsWhereInput = {
      is_visible: true,
      animal_distributions: {
        some: {
          country_id: countryId,
          distribution_status: statusFilter,
        },
      },
      ...searchCondition,
    };

    const [animals, total] = await Promise.all([
      prisma.animals.findMany({
        where: whereClause,
        select: {
          id: true,
          canonical_slug: true,
          animal_name: true,
          scientific_name: true,
          family: true,
          animal_images: {
            take: 1,
            select: {
              image_url: true,
            },
          },
        },
        orderBy: {
          animal_name: "asc",
        },
        take: limit,
        skip: skip,
      }),
      prisma.animals.count({
        where: whereClause,
      }),
    ]);

    return {
      animals,
      total,
    };
  },
};