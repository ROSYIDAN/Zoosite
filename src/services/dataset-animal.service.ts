import { datasetAnimalRepo } from "@/repositories/dataset-animal.repo";
import type { LimitQueryInput } from "@/lib/validations/common.schema";

export const datasetAnimalService = {
  /**
   * Lists dataset animals with an optional limit.
   */
  async list(query: LimitQueryInput) {
    return datasetAnimalRepo.findMany(query);
  },
};
