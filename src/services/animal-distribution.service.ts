import { AppError } from "@/lib/errors";
import { animalDistributionRepo } from "@/repositories/animal-distribution.repo";
import { checkLocalImageExists } from "@/lib/image-utils";
import {
  animalDistributionQuerySchema,
  nativeAnimalsQuerySchema,
  type AnimalDistributionQuery,
  type NativeAnimalsQuery,
} from "@/lib/validations/animal-distribution.schema";
import { DistributionStatus } from "@prisma/client";

export const animalDistributionService = {
  /**
   * Retrieves an animal by its name and returns its geographical distributions
   * and habitats.
   * Throws AppError(404) if the animal is not found.
   */
  async getDistributionByName(query: AnimalDistributionQuery) {
    const validated = animalDistributionQuerySchema.safeParse(query);
    if (!validated.success) {
      throw new AppError(validated.error.issues[0]?.message || "Invalid input", 400);
    }

    const name = validated.data.name;
    const animal = await animalDistributionRepo.findAnimalByName(name);
    
    if (!animal) {
      throw new AppError(`Animal not found: ${name}`, 404, "NOT_FOUND");
    }

    const animalId = animal.id;

    // Fetch geo and habitat data concurrently
    const [geoData, habitatData] = await Promise.all([
      animalDistributionRepo.getGeoDataByAnimalId(animalId),
      animalDistributionRepo.getHabitatDataByAnimalId(animalId)
    ]);

    // Build the final response
    const countries = geoData.map((row) => row.country);
    const regions = [
      ...new Set(
        geoData.map((row) => row.region).filter((r): r is string => r !== null)
      ),
    ];
    const habitats = habitatData.map((row) => row.habitat);

    return {
      name: animal.animal_name,
      countries,
      regions,
      habitats,
    };
  },

  /**
   * Retrieves a list of all countries.
   */
  async getAllCountries() {
    const countries = await animalDistributionRepo.getAllCountries();
    return countries.map((c) => ({
      id: c.id,
      name: c.country,
      flag: c.country_flag,
      region: c.regions?.region || null,
    }));
  },

  /**
   * Retrieves native and/or endemic animals in a country with filtering, search, and pagination.
   */
  async getNativeAnimals(query: NativeAnimalsQuery) {
    const validated = nativeAnimalsQuerySchema.safeParse(query);
    if (!validated.success) {
      throw new AppError(validated.error.issues[0]?.message || "Invalid input", 400);
    }

    const { countryId, status, search, region, province, locality, page, limit, sortBy } = validated.data;

    // 1. Verify country exists
    const country = await animalDistributionRepo.getCountryById(countryId);
    if (!country) {
      throw new AppError("Country not found", 404, "NOT_FOUND");
    }

    // 2. Fetch animals (retrieve a larger batch to filter imageless ones in memory)
    const { animals } = await animalDistributionRepo.getNativeAnimals(countryId, {
      status,
      search,
      region,
      province,
      locality,
      limit: 1000,
      skip: 0,
      sortBy,
    });

    const filterResults = await Promise.all(
      animals.map(async (a: any) => {
        const hasImageUrl = a.animal_images?.some((img: any) => img.image_url);
        const exists = hasImageUrl || await checkLocalImageExists(a.id);
        return { a, exists };
      })
    );

    const filtered = filterResults.filter((r) => r.exists).map((r) => r.a);
    const total = filtered.length;
    const start = (page - 1) * limit;
    const sliced = filtered.slice(start, start + limit);

    // 3. Format result
    const formattedAnimals = sliced.map((a) => ({
      id: a.id,
      slug: a.canonical_slug || "",
      name: a.animal_name || "",
      scientific_name: a.scientific_name,
      family: a.family,
      image: a.animal_images[0]?.image_url || "/static_image.png",
      status: a.animal_distributions[0]?.distribution_status || "NATIVE",
      region_name: a.animal_distributions[0]?.region_name || null,
      province: a.animal_distributions[0]?.province || null,
      locality: a.animal_distributions[0]?.specific_locality || null,
    }));

    const formattedCountry = {
      id: country.id,
      name: country.country,
      flag: country.country_flag,
      region: country.regions?.region || null,
    };

    return {
      animals: formattedAnimals,
      country: formattedCountry,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get available location filter options for a specific country.
   */
  async getLocationFilterOptions(countryId: string) {
    // Verify country exists
    const country = await animalDistributionRepo.getCountryById(countryId);
    if (!country) {
      throw new AppError("Country not found", 404, "NOT_FOUND");
    }

    return await animalDistributionRepo.getLocationFilterOptions(countryId);
  },
};
