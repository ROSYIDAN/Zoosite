import { prisma } from "@/lib/prisma";

export const browseRepo = {
  async getRegionsBrowse() {
    return prisma.$queryRawUnsafe<any[]>(`
      SELECT 
          r.id, 
          r.region as region_name,
          r.imageurl as image_url,
          (
              SELECT COUNT(DISTINCT ad.animal_id)
              FROM countries c
              JOIN animal_distributions ad ON ad.country_id = c.id
              JOIN animals a ON ad.animal_id = a.id
              WHERE c.region_id = r.id AND a.is_visible = true
          )::int as animal_count,
          (
              SELECT h.habitat_name
              FROM countries c
              JOIN animal_distributions ad ON ad.country_id = c.id
              JOIN animal_environment ae ON ae.animal_id = ad.animal_id
              JOIN habitat h ON h.id = ae.habitat_id
              JOIN animals a ON ad.animal_id = a.id
              WHERE c.region_id = r.id AND a.is_visible = true
              GROUP BY h.habitat_name
              ORDER BY COUNT(DISTINCT ad.animal_id) DESC
              LIMIT 1
          ) as top_habitat
      FROM regions r
      WHERE r.region IS NOT NULL
      ORDER BY r.region ASC
    `);
  },

  async getHabitatsBrowse() {
    return prisma.habitat.findMany({
      select: { habitat_name: true },
      where: { habitat_name: { not: null } },
      orderBy: { habitat_name: "asc" },
    });
  },

  async getAnimalClasses() {
    return prisma.animal_class.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  },

  async countAnimalsByClass(classId: string) {
    return prisma.animals.count({
      where: { class_id: classId, is_visible: true },
    });
  },
};