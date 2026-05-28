import { AppError } from "@/lib/errors";
import { animalDistributionRepo } from "@/repositories/animal-distribution.repo";
import type { AnimalDistributionQuery } from "@/lib/validations/animal-distribution.schema";

export const animalDistributionService = {
  /**
   * Retrieves an animal by its name and returns its geographical distributions
   * and habitats.
   * Throws AppError(404) if the animal is not found.
   */
  async getDistributionByName(query: AnimalDistributionQuery) {
    const animal = await animalDistributionRepo.findAnimalByName(query.name);
    
    if (!animal) {
      throw new AppError(`Animal not found: ${query.name}`, 404, "NOT_FOUND");
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
};
