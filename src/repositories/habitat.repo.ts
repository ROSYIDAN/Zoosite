import { prisma } from "@/lib/prisma";

export const habitatRepo = {
  /**
   * Fetch all available habitats.
   */
  async findAll() {
    return prisma.habitat.findMany({
      orderBy: { habitat_name: "asc" },
      select: {
        id: true,
        habitat_name: true,
      },
    });
  },

  /**
   * Search habitats by name.
   */
  async search(query: string) {
    return prisma.habitat.findMany({
      where: {
        habitat_name: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: { habitat_name: "asc" },
      select: {
        id: true,
        habitat_name: true,
      },
      take: 10,
    });
  },

  /**
   * Ensure habitats exist in the DB and return their IDs.
   * If a habitat doesn't exist, it creates it.
   */
  async findOrCreate(names: string[]) {
    if (!names || names.length === 0) return [];

    const habitatIds: { id: string }[] = [];

    for (const name of names) {
      // Habitats don't have a unique constraint on name in the schema, 
      // but we treat them as unique by name for this flow.
      const existing = await prisma.habitat.findFirst({
        where: { habitat_name: { equals: name.trim(), mode: "insensitive" } },
        select: { id: true },
      });

      if (existing) {
        habitatIds.push(existing);
      } else {
        const newHabitat = await prisma.habitat.create({
          data: {
            habitat_name: name.trim(),
          },
          select: { id: true },
        });
        habitatIds.push(newHabitat);
      }
    }

    return habitatIds;
  },
};
