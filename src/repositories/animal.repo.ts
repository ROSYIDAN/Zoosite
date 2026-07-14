import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { slugify } from "@/lib/utils";
import type { CreateAnimalInput, ListAnimalsQuery } from "@/lib/validations/animal.schema";
import { hasDatasetDetailValue, toDatasetAnimalData } from "@/lib/mappers/animal.mapper";
import { tagRepo } from "@/repositories/tag.repo";
import { habitatRepo } from "@/repositories/habitat.repo";
import { animalDistributionRepo } from "@/repositories/animal-distribution.repo";

// ── Transaction Sub-write Helpers ──

async function createDescription(
  tx: Prisma.TransactionClient,
  animalId: string,
  summary: string,
  sourceUrl?: string | null
) {
  return tx.animal_descriptions.create({
    data: {
      animal_id: animalId,
      summary,
      source: "admin_panel",
      source_url: sourceUrl || null,
    },
  });
}

async function updateDescription(
  tx: Prisma.TransactionClient,
  animalId: string,
  summary: string,
  sourceUrl?: string | null
) {
  const existingDesc = await tx.animal_descriptions.findFirst({
    where: { animal_id: animalId },
  });
  if (existingDesc) {
    return tx.animal_descriptions.update({
      where: { id: existingDesc.id },
      data: {
        summary,
        source_url: sourceUrl || null,
      },
    });
  } else {
    return tx.animal_descriptions.create({
      data: {
        animal_id: animalId,
        summary,
        source: "admin_panel",
        source_url: sourceUrl || null,
      },
    });
  }
}

async function createImage(
  tx: Prisma.TransactionClient,
  animalId: string,
  imageUrl: string,
  source?: string | null,
  photographerName?: string | null
) {
  return tx.animal_images.create({
    data: {
      animal_id: animalId,
      image_url: imageUrl,
      source: source || null,
      photographer_name: photographerName || null,
    },
  });
}

async function updateImage(
  tx: Prisma.TransactionClient,
  animalId: string,
  imageUrl: string,
  source?: string | null,
  photographerName?: string | null
) {
  const existingImage = await tx.animal_images.findFirst({
    where: { animal_id: animalId },
  });
  if (existingImage) {
    return tx.animal_images.update({
      where: { id: existingImage.id },
      data: {
        image_url: imageUrl,
        source: source || null,
        photographer_name: photographerName || null,
      },
    });
  } else {
    return tx.animal_images.create({
      data: {
        animal_id: animalId,
        image_url: imageUrl,
        source: source || null,
        photographer_name: photographerName || null,
      },
    });
  }
}

async function createDatasetDetails(
  tx: Prisma.TransactionClient,
  animalId: string,
  input: CreateAnimalInput
) {
  if (!hasDatasetDetailValue(input)) return null;
  return tx.dataset_animals.create({
    data: {
      animal_id: animalId,
      ...toDatasetAnimalData(input),
    },
  });
}

async function updateDatasetDetails(
  tx: Prisma.TransactionClient,
  animalId: string,
  input: CreateAnimalInput
) {
  const existingDataset = await tx.dataset_animals.findFirst({
    where: { animal_id: animalId },
    select: { id: true },
  });

  if (existingDataset) {
    return tx.dataset_animals.update({
      where: { id: existingDataset.id },
      data: toDatasetAnimalData(input),
    });
  } else if (hasDatasetDetailValue(input)) {
    return tx.dataset_animals.create({
      data: {
        animal_id: animalId,
        ...toDatasetAnimalData(input),
      },
    });
  }
  return null;
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
      region_name: true,
      province: true,
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

      // 2. Create description
      if (input.description) {
        await createDescription(tx, animal.id, input.description, input.description_source);
      }

      // 3. Create image
      if (input.image) {
        await createImage(tx, animal.id, input.image, input.image_source, input.photographer_name);
      }

      // 4. Create dataset details
      await createDatasetDetails(tx, animal.id, input);

      // 5. Connect tags
      if (input.tags) {
        await tagRepo.connectTags(tx, animal.id, input.tags);
      }

      // 6. Create distributions
      if (input.countries) {
        await animalDistributionRepo.createDistributions(tx, animal.id, input.countries, input.specific_localities);
      }

      // 7. Create habitats
      if (input.habitats) {
        await habitatRepo.createHabitats(tx, animal.id, input.habitats);
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
        await updateDescription(tx, id, input.description, input.description_source);
      }

      // 3. Sync dataset details
      await updateDatasetDetails(tx, id, input);

      // 4. Sync tags
      if (input.tags) {
        await tagRepo.syncTags(tx, id, input.tags);
      }

      // 5. Sync distributions
      if (input.countries) {
        await animalDistributionRepo.syncDistributions(tx, id, input.countries, input.specific_localities);
      }

      // 6. Sync habitats
      if (input.habitats) {
        await habitatRepo.syncHabitats(tx, id, input.habitats);
      }

      // 7. Sync image
      if (input.image) {
        await updateImage(tx, id, input.image, input.image_source, input.photographer_name);
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
