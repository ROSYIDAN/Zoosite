import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { slugify } from "@/lib/utils";
import type { CreateAnimalInput, ListAnimalsQuery } from "@/lib/validations/animal.schema";

function hasDatasetDetailValue(input: CreateAnimalInput) {
  return Boolean(
    input.diet ||
    input.lifespan_years ||
    input.weight_kg ||
    input.height_cm ||
    input.avg_speed_kmh ||
    input.top_speed_kmh ||
    input.social_structure ||
    input.conservation_status ||
    input.predators
  );
}

function toDatasetAnimalData(input: CreateAnimalInput) {
  return {
    animal_name: input.name,
    diet: input.diet || null,
    lifespan_years: input.lifespan_years || null,
    weight_kg: input.weight_kg || null,
    height_cm: input.height_cm || null,
    avg_speed_kmh: input.avg_speed_kmh || null,
    top_speed_kmh: input.top_speed_kmh || null,
    social_structure: input.social_structure || null,
    conservation_status: input.conservation_status || null,
    predators: input.predators || null,
  };
}

async function buildUniqueAnimalSlug(
  tx: Prisma.TransactionClient,
  name: string
) {
  const baseSlug = slugify(name);
  let candidateSlug = baseSlug;
  let suffix = 2;

  while (true) {
    const existingAnimal = await tx.animals.findUnique({
      where: { canonical_slug: candidateSlug },
      select: { id: true },
    });

    if (!existingAnimal) {
      return candidateSlug;
    }

    candidateSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

// ── Select shapes (never return full Prisma objects) ──

const animalListSelect = {
  id: true,
  canonical_slug: true,
  animal_name: true,
  scientific_name: true,
  synonyms: true,
  family: true,
  genus: true,
  ordo: true,
  created_at: true,
  is_visible: true,
  animal_images: {
    select: { image_url: true },
  },
  tags: {
    select: { id: true, name: true, slug: true, color: true }
  }
};

const animalDetailSelect = {
  id: true,
  canonical_slug: true,
  animal_name: true,
  scientific_name: true,
  synonyms: true,
  family: true,
  genus: true,
  ordo: true,
  class_id: true,
  is_visible: true,
  animal_images: {
    select: { image_url: true, source: true, photographer_name: true },
  },
  tags: {
    select: { id: true, name: true, slug: true, color: true }
  },
  animal_descriptions: {
    select: { summary: true, source: true, source_url: true },
  },
  animal_environment: {
    select: {
      habitat: { select: { habitat_name: true } },
    },
  },

  dataset_animals: {
    select: {
      height_cm: true,
      weight_kg: true,
      lifespan_years: true,
      diet: true,
      predators: true,
      avg_speed_kmh: true,
      top_speed_kmh: true,
      social_structure: true,
      offspring_per_birth: true,
      gestation_days: true,
      color: true,
      conservation_status: true,
    },
  },
  animal_distributions: {
    select: {
      specific_locality: true,
      countries: {
        select: {
          id: true,
          country: true,
          country_flag: true,
          regions: { select: { region: true } },
        },
      },
    },
  },
};

// ── Repository ──

export const animalRepo = {
  /**
   * List animals with optional diet filter and pagination.
   */
  async findMany(query: ListAnimalsQuery & { includeHidden?: boolean }) {
    const {
      limit = 10,
      page = 1,
      diet,
      search,
      sort = "created_at",
      order = "desc",
      includeHidden = false
    } = query;
    const skip = (page - 1) * limit;

    let where: Prisma.animalsWhereInput = {};
    const andConditions: Prisma.animalsWhereInput[] = [];

    if (diet) {
      const matchingDiets = await prisma.$queryRaw<{ animal_name: string }[]>(
        Prisma.sql`SELECT animal_name FROM dataset_animals WHERE diet ILIKE ${"%" + diet + "%"}`
      );
      const animalNames = matchingDiets.map((d) => d.animal_name).filter(Boolean);

      if (animalNames.length === 0) return [];

      andConditions.push({
        animal_name: { in: animalNames, mode: "insensitive" },
      });
    }

    if (search) {
      andConditions.push({
        OR: [
          { animal_name: { contains: search, mode: "insensitive" } },
          { scientific_name: { contains: search, mode: "insensitive" } },
          { synonyms: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (!includeHidden) {
      andConditions.push({ is_visible: true });
    }

    if (andConditions.length > 0) {
      where = { AND: andConditions };
    }

    // Map sort key to DB column
    const sortField = sort === "name" ? "animal_name" : sort;

    return prisma.animals.findMany({
      where,
      select: animalListSelect,
      take: limit,
      skip,
      orderBy: { [sortField]: order },
    });
  },

  /**
   * Count animals matching the given filters (for pagination meta).
   */
  async count(query: ListAnimalsQuery & { includeHidden?: boolean }) {
    const { diet, search, includeHidden = false } = query;

    let where: Prisma.animalsWhereInput = {};
    const andConditions: Prisma.animalsWhereInput[] = [];

    if (diet) {
      const matchingDiets = await prisma.$queryRaw<{ animal_name: string }[]>(
        Prisma.sql`SELECT animal_name FROM dataset_animals WHERE diet ILIKE ${"%" + diet + "%"}`
      );
      const animalNames = matchingDiets.map((d) => d.animal_name).filter(Boolean);

      if (animalNames.length === 0) return 0;

      andConditions.push({
        animal_name: { in: animalNames, mode: "insensitive" },
      });
    }

    if (search) {
      andConditions.push({
        OR: [
          { animal_name: { contains: search, mode: "insensitive" } },
          { scientific_name: { contains: search, mode: "insensitive" } },
          { synonyms: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (!includeHidden) {
      andConditions.push({ is_visible: true });
    }

    if (andConditions.length > 0) {
      where = { AND: andConditions };
    }

    return prisma.animals.count({ where });
  },

  /**
   * Find a single animal by its canonical slug with all relations.
   */
  async findBySlug(slug: string) {
    return prisma.animals.findUnique({
      where: { canonical_slug: slug },
      select: animalDetailSelect,
    });
  },

  /**
   * Find a single animal by its ID with all relations.
   */
  async findById(id: string) {
    return prisma.animals.findUnique({
      where: { id },
      select: animalDetailSelect,
    });
  },

  /**
   * Find only the animal ID by its canonical slug (lightweight lookup).
   */
  async findIdBySlug(slug: string) {
    return prisma.animals.findUnique({
      where: { canonical_slug: slug },
      select: { id: true },
    });
  },

  /**
   * Create an animal with its related description, image, and stats
   * inside a single transaction.
   */
  async createWithRelations(input: CreateAnimalInput & { contributed_by?: string }) {
    return prisma.$transaction(async (tx) => {
      const slug = await buildUniqueAnimalSlug(tx, input.name);

      // 1. Create the base animal record
      const animal = await tx.animals.create({
        data: {
          animal_name: input.name,
          scientific_name: input.scientific_name,
          synonyms: input.synonyms || null,
          family: input.family || null,
          genus: input.genus || null,
          ordo: input.diet || null,
          class_id: input.class_id || null,
          canonical_slug: slug,
          contributed_by: input.contributed_by || null,
        },
        select: { id: true, canonical_slug: true, family: true, genus: true, created_at: true },
      });

      // 2. Create the description if provided
      if (input.description) {
        await tx.animal_descriptions.create({
          data: {
            animal_id: animal.id,
            summary: input.description,
            source: "admin_panel",
            source_url: input.description_source || null,
          },
        });
      }

      // 3. Create the image if provided
      if (input.image) {
        await tx.animal_images.create({
          data: {
            animal_id: animal.id,
            image_url: input.image,
            source: input.image_source || null,
            photographer_name: input.photographer_name || null,
          },
        });
      }

      // 4. Create the dataset record for supported detail-page stats
      if (hasDatasetDetailValue(input)) {
        await tx.dataset_animals.create({
          data: {
            animal_id: animal.id,
            ...toDatasetAnimalData(input),
          },
        });
      }

      // 5. Connect Tags if provided
      if (input.tags && input.tags.length > 0) {
        await tx.animals.update({
          where: { id: animal.id },
          data: {
            tags: {
              connect: input.tags.map(t => ({ id: t }))
            }
          }
        });
      }

      // 6. Create Animal Distributions (Countries) if provided
      if (input.countries && input.countries.length > 0) {
        await tx.animal_distributions.createMany({
          data: input.countries.map(countryId => ({
            animal_id: animal.id,
            country_id: countryId,
            specific_locality: input.specific_localities?.[countryId] || null,
          }))
        });
      }

      // 7. Create Animal Environment (Habitats) if provided
      if (input.habitats && input.habitats.length > 0) {
        const { habitatRepo } = await import("@/repositories/habitat.repo");
        const habitats = await habitatRepo.findOrCreate(input.habitats);

        await tx.animal_environment.createMany({
          data: habitats.map(h => ({
            animal_id: animal.id,
            habitat_id: h.id,
          }))
        });
      }

      return animal;
    });
  },

  /**
   * Update an existing animal and sync its relations, including tags.
   */
  async updateWithRelations(id: string, input: CreateAnimalInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Update base animal
      const animal = await tx.animals.update({
        where: { id },
        data: {
          animal_name: input.name,
          scientific_name: input.scientific_name,
          synonyms: input.synonyms || null,
          family: input.family || null,
          genus: input.genus || null,
          ordo: input.diet || null,
          class_id: input.class_id || null,
        },
      });

      // 2. Update description
      if (input.description) {
        const existingDesc = await tx.animal_descriptions.findFirst({
          where: { animal_id: id }
        });
        if (existingDesc) {
          await tx.animal_descriptions.update({
            where: { id: existingDesc.id },
            data: {
              summary: input.description,
              source_url: input.description_source || null,
            }
          });
        } else {
          await tx.animal_descriptions.create({
            data: {
              animal_id: id,
              summary: input.description,
              source: "admin_panel",
              source_url: input.description_source || null,
            }
          });
        }
      }

      // 3. Sync the supported dataset detail fields
      const existingDataset = await tx.dataset_animals.findFirst({
        where: { animal_id: id },
        select: { id: true },
      });

      if (existingDataset) {
        await tx.dataset_animals.update({
          where: { id: existingDataset.id },
          data: toDatasetAnimalData(input),
        });
      } else if (hasDatasetDetailValue(input)) {
        await tx.dataset_animals.create({
          data: {
            animal_id: id,
            ...toDatasetAnimalData(input),
          },
        });
      }

      // 4. Sync Tags (set replaces all existing connections)
      if (input.tags) {
        await tx.animals.update({
          where: { id },
          data: {
            tags: {
              set: input.tags.map(t => ({ id: t }))
            }
          }
        });
      }

      // 5. Sync Countries (Distribution)
      if (input.countries) {
        const existingDistributions = await tx.animal_distributions.findMany({
          where: { animal_id: id }
        });
        const statusMap = new Map(existingDistributions.map(d => [d.country_id, d.distribution_status]));

        await tx.animal_distributions.deleteMany({
          where: { animal_id: id }
        });

        if (input.countries.length > 0) {
          await tx.animal_distributions.createMany({
            data: input.countries.map(countryId => ({
              animal_id: id,
              country_id: countryId,
              distribution_status: statusMap.get(countryId) || "NATIVE",
              specific_locality: input.specific_localities?.[countryId] || null,
            }))
          });
        }
      }

      // 6. Sync Habitats (Environment)
      if (input.habitats) {
        await tx.animal_environment.deleteMany({
          where: { animal_id: id }
        });

        if (input.habitats.length > 0) {
          const { habitatRepo } = await import("@/repositories/habitat.repo");
          const habitats = await habitatRepo.findOrCreate(input.habitats);

          await tx.animal_environment.createMany({
            data: habitats.map(h => ({
              animal_id: id,
              habitat_id: h.id,
            }))
          });
        }
      }

      // 7. Sync Image
      if (input.image) {
        const existingImage = await tx.animal_images.findFirst({
          where: { animal_id: id },
        });
        if (existingImage) {
          await tx.animal_images.update({
            where: { id: existingImage.id },
            data: {
              image_url: input.image,
              source: input.image_source || null,
              photographer_name: input.photographer_name || null,
            },
          });
        } else {
          await tx.animal_images.create({
            data: {
              animal_id: id,
              image_url: input.image,
              source: input.image_source || null,
            },
          });
        }
      }

      return animal;
    });
  },

  /**
   * Finds the first ImgBB URL for a given animal ID.
   */
  async findImgbbUrlByAnimalId(id: string) {
    return prisma.animal_images.findFirst({
      where: {
        animal_id: id,
        image_url: {
          contains: "ibb.co",
        },
      },
      select: { image_url: true },
    });
  },

  /**
   * Adds a new ImgBB URL for a given animal ID.
   */
  async createImgbbUrl(id: string, url: string) {
    return prisma.animal_images.create({
      data: {
        animal_id: id,
        image_url: url,
      },
      select: { image_url: true },
    });
  },
};
