import { AppError } from "@/lib/errors";
import { animalRepo } from "@/repositories/animal.repo";
import {
  toAnimalDetail,
  toAnimalListItem,
  toCreatedAnimal,
} from "@/lib/mappers/animal.mapper";
import type {
  CreateAnimalInput,
  ListAnimalsQuery,
} from "@/lib/validations/animal.schema";

import { checkLocalImageExists, uploadToImgbb } from "@/lib/image-utils";
import { IMAGES_DIR, SUPPORTED_EXTENSIONS } from "@/lib/constants";
import path from "path";
import fs from "fs/promises";

export const animalService = {
  /**
   * List animals with optional diet filter and pagination.
   * Returns { data, meta } shape.
   */
  async list(query: ListAnimalsQuery) {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;

    // Fetch a larger batch (or all) to filter in memory
    const rawAll = await animalRepo.findMany({ ...query, limit: 1000, page: 1 });

    const filterResults = await Promise.all(
      rawAll.map(async (item: any) => {
        const hasImageUrl = item.animal_images?.some((img: any) => img.image_url);
        const exists = hasImageUrl || await checkLocalImageExists(item.id);
        return { item, exists };
      })
    );

    const filtered = filterResults.filter((r) => r.exists).map((r) => r.item);
    const total = filtered.length;
    const start = (page - 1) * limit;
    const sliced = filtered.slice(start, start + limit);

    return {
      data: sliced.map(toAnimalListItem),
      meta: { total, page, limit },
    };
  },

  /**
   * Get a single animal by slug.
   * Throws AppError(404) if not found.
   */
  async getBySlug(slug: string) {
    const raw = await animalRepo.findBySlug(slug);
    if (!raw) throw new AppError("Animal not found", 404, "NOT_FOUND");
    return toAnimalDetail(raw);
  },

  /**
   * Get only the animal ID by slug (lightweight, for image serving).
   * Throws AppError(404) if not found.
   */
  async getIdBySlug(slug: string) {
    const raw = await animalRepo.findIdBySlug(slug);
    if (!raw) throw new AppError("Animal not found", 404, "NOT_FOUND");
    return raw.id;
  },

  /**
   * Create a new animal with its related records.
   */
  async create(input: CreateAnimalInput) {
    const { tags, ...rest } = input;
    let tagIds: string[] = [];

    if (tags && tags.length > 0) {
      // Import tagRepo dynamically if not at top level, or just import it at the top
      const { tagRepo } = await import("@/repositories/tag.repo");
      const dbTags = await tagRepo.findOrCreate(tags);
      tagIds = dbTags.map(t => t.id);
    }

    const raw = await animalRepo.createWithRelations({
      ...rest,
      tags: tagIds,
    });
    return toCreatedAnimal(raw);
  },

  /**
   * Get the ImgBB URL for an animal. Uploads from local file if not found in DB.
   */
  async getImgbbUrl(id: string) {
    // 1. Check if ImgBB URL exists in DB
    const existing = await animalRepo.findImgbbUrlByAnimalId(id);
    if (existing?.image_url) {
      return existing.image_url;
    }

    // 2. Find local file
    let localFilePath: string | null = null;
    for (const ext of SUPPORTED_EXTENSIONS) {
      const filePath = path.join(IMAGES_DIR, `${id}${ext}`);
      try {
        await fs.access(filePath);
        localFilePath = filePath;
        break;
      } catch {
        continue;
      }
    }

    if (!localFilePath) {
      throw new AppError("Local image file not found for animal", 404, "NOT_FOUND");
    }

    // 3. Upload to ImgBB
    try {
      const imgbbUrl = await uploadToImgbb(localFilePath);
      // 4. Save to DB
      await animalRepo.createImgbbUrl(id, imgbbUrl);
      return imgbbUrl;
    } catch (err: any) {
      throw new AppError(`ImgBB upload failed: ${err.message}`, 500, "EXTERNAL_API_ERROR");
    }
  },
};

