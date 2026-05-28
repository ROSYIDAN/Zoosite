import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { LimitQueryInput } from "@/lib/validations/common.schema";

export const datasetAnimalRepo = {
  /**
   * Fetches dataset animals with an optional limit.
   */
  async findMany(query: LimitQueryInput) {
    if (query.limit) {
      return prisma.$queryRaw(
        Prisma.sql`SELECT * FROM dataset_animals LIMIT ${query.limit}`
      );
    }
    return prisma.$queryRaw(Prisma.sql`SELECT * FROM dataset_animals`);
  },
};
