import { habitatRepo } from "@/repositories/habitat.repo";

export const habitatService = {
  /**
   * Get fine-grained habitats inside specific IDs with visible species counts.
   */
  async getHabitatsWithVisibleAnimalCounts(ids: string[]) {
    return habitatRepo.findWithVisibleAnimalCounts(ids);
  },
};
