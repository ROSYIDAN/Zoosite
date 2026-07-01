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
      region?: string;
      province?: string;
      locality?: string;
      limit: number;
      skip: number;
      sortBy?: "name" | "newest";
    }
  ) {
    const { status = "ALL", search, region, province, locality, limit, skip, sortBy = "name" } = options;

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

    // Build location filters for animal_distributions
    const distributionFilters: any = {
      country_id: countryId,
      distribution_status: statusFilter,
    };

    if (region) {
      distributionFilters.region_name = region;
    }
    if (province) {
      distributionFilters.province = province;
    }
    if (locality) {
      distributionFilters.specific_locality = locality;
    }

    const whereClause: Prisma.animalsWhereInput = {
      is_visible: true,
      animal_distributions: {
        some: distributionFilters,
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
          animal_distributions: {
            where: {
              country_id: countryId,
            },
            select: {
              distribution_status: true,
              region_name: true,
              province: true,
              specific_locality: true,
            },
          },
        },
        orderBy: sortBy === "newest"
          ? { created_at: "desc" as const }
          : { animal_name: "asc" as const },
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

  /**
   * Fetch unique location filter options for a specific country.
   * Returns distinct regions, provinces, and localities.
   */
  async getLocationFilterOptions(countryId: string) {
    const distributions = await prisma.animal_distributions.findMany({
      where: {
        country_id: countryId,
        distribution_status: {
          in: [DistributionStatus.NATIVE, DistributionStatus.ENDEMIC],
        },
      },
      select: {
        region_name: true,
        province: true,
        specific_locality: true,
      },
      distinct: ['region_name', 'province', 'specific_locality'],
    });

    // Extract unique values, parse JSON arrays, and filter out nulls
    const regions = [...new Set(
      distributions
        .flatMap(d => {
          if (!d.region_name) return [];
          try {
            const parsed = JSON.parse(d.region_name);
            return Array.isArray(parsed) ? parsed : [d.region_name];
          } catch {
            return [d.region_name];
          }
        })
        .filter((r): r is string => typeof r === 'string' && r.trim().length > 0)
    )].sort();

    const provinces = [...new Set(
      distributions
        .flatMap(d => {
          if (!d.province) return [];
          try {
            const parsed = JSON.parse(d.province);
            return Array.isArray(parsed) ? parsed : [d.province];
          } catch {
            return [d.province];
          }
        })
        .filter((p): p is string => typeof p === 'string' && p.trim().length > 0)
    )].sort();

    const localities = [...new Set(
      distributions
        .flatMap(d => {
          if (!d.specific_locality) return [];
          try {
            const parsed = JSON.parse(d.specific_locality);
            return Array.isArray(parsed) ? parsed : [d.specific_locality];
          } catch {
            return [d.specific_locality];
          }
        })
        .filter((l): l is string => typeof l === 'string' && l.trim().length > 0)
    )].sort();

    return {
      regions,
      provinces,
      localities,
    };
  },
};
