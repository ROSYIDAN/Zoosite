import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { RequestAnimalInput, UpdateRequestInput } from "@/lib/validations/animal-request.schema";

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const isUuid = (id?: string | null): boolean => !!id && UUID_REGEX.test(id);

// ── Select shapes for clean responses (no raw Prisma leakage) ──

const requestUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  is_request_banned: true,
  request_banned_until: true,
};

const requestDetailSelect = {
  id: true,
  request_type: true,
  status: true,
  animal_name: true,
  image_url: true,
  image_public_id: true,
  scientific_name: true,
  family: true,
  genus: true,
  ordo: true,
  class_id: true,
  description: true,
  description_source: true,
  diet: true,
  lifespan_years: true,
  weight_kg: true,
  height_cm: true,
  avg_speed_kmh: true,
  top_speed_kmh: true,
  social_structure: true,
  conservation_status: true,
  predators: true,
  tags: true,
  countries: true,
  habitats: true,
  review_started: true,
  reject_reason: true,
  approved_animal_id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
  user: {
    select: requestUserSelect,
  },
  approved_animal: {
    select: {
      id: true,
      canonical_slug: true,
    },
  },
};

export const animalRequestRepo = {
  /**
   * Find a specific request by ID.
   */
  async findById(id: string) {
    if (!isUuid(id)) return null;
    return prisma.animal_requests.findUnique({
      where: { id },
      select: requestDetailSelect,
    });
  },

  /**
   * Find requests submitted by a specific user.
   */
  async findByUserId(userId: string) {
    if (!isUuid(userId)) return [];
    return prisma.animal_requests.findMany({
      where: { user_id: userId },
      select: requestDetailSelect,
      orderBy: { created_at: "desc" },
    });
  },

  /**
   * Counts the number of rejected requests for a specific user.
   */
  async getRejectionCount(userId: string): Promise<number> {
    if (!isUuid(userId)) return 0;
    return prisma.animal_requests.count({
      where: {
        user_id: userId,
        status: "REJECTED",
      },
    });
  },

  /**
   * Checks if an animal with a given name exists in the database.
   */
  async checkDuplicateAnimal(name: string) {
    return prisma.animals.findFirst({
      where: {
        animal_name: { equals: name, mode: "insensitive" },
      },
      select: {
        id: true,
        canonical_slug: true,
        animal_name: true,
        scientific_name: true,
        family: true,
      },
    });
  },

  /**
   * Checks if there is an active request (PENDING or IN_REVIEW) with that name.
   */
  async checkActiveRequest(name: string) {
    return prisma.animal_requests.findFirst({
      where: {
        animal_name: { equals: name, mode: "insensitive" },
        status: { in: ["PENDING", "IN_REVIEW"] },
      },
      select: {
        id: true,
        animal_name: true,
        status: true,
      },
    });
  },

  /**
   * Creates a new animal request.
   */
  async create(input: RequestAnimalInput, userId: string) {
    return prisma.animal_requests.create({
      data: {
        request_type: input.request_type,
        status: "PENDING",
        animal_name: input.animal_name,
        image_url: input.image_url || null,
        image_public_id: input.image_public_id || null,
        scientific_name: input.scientific_name || null,
        family: input.family || null,
        genus: input.genus || null,
        ordo: input.ordo || null,
        class_id: input.class_id || null,
        description: input.description || null,
        description_source: input.description_source || null,
        diet: input.diet || null,
        lifespan_years: input.lifespan_years || null,
        weight_kg: input.weight_kg || null,
        height_cm: input.height_cm || null,
        avg_speed_kmh: input.avg_speed_kmh || null,
        top_speed_kmh: input.top_speed_kmh || null,
        social_structure: input.social_structure || null,
        conservation_status: input.conservation_status || null,
        predators: input.predators || null,
        tags: input.tags || [],
        countries: input.countries || [],
        habitats: input.habitats || [],
        user_id: userId,
      },
      select: { id: true },
    });
  },

  /**
   * Updates an existing request.
   */
  async update(id: string, input: UpdateRequestInput) {
    return prisma.animal_requests.update({
      where: { id },
      data: {
        animal_name: input.animal_name,
        image_url: input.image_url,
        image_public_id: input.image_public_id,
        scientific_name: input.scientific_name,
        family: input.family,
        genus: input.genus,
        ordo: input.ordo,
        class_id: input.class_id,
        description: input.description,
        description_source: input.description_source,
        diet: input.diet,
        lifespan_years: input.lifespan_years,
        weight_kg: input.weight_kg,
        height_cm: input.height_cm,
        avg_speed_kmh: input.avg_speed_kmh,
        top_speed_kmh: input.top_speed_kmh,
        social_structure: input.social_structure,
        conservation_status: input.conservation_status,
        predators: input.predators,
        tags: input.tags || undefined,
        countries: input.countries || undefined,
        habitats: input.habitats || undefined,
      },
      select: { id: true },
    });
  },

  /**
   * Deletes (withdraws) a request.
   */
  async delete(id: string) {
    return prisma.animal_requests.delete({
      where: { id },
      select: { id: true },
    });
  },

  /**
   * Lists all requests for the admin.
   */
  async listAllForAdmin() {
    return prisma.animal_requests.findMany({
      select: requestDetailSelect,
      orderBy: { created_at: "desc" },
    });
  },

  /**
   * Auto-unlocks reviews that have been idle for >30 minutes.
   */
  async revertAbandonedLocks(thirtyMinsAgo: Date) {
    return prisma.animal_requests.updateMany({
      where: {
        status: "IN_REVIEW",
        review_started: { lt: thirtyMinsAgo },
      },
      data: {
        status: "PENDING",
        review_started: null,
      },
    });
  },

  /**
   * Locks the request atomically for review, returning true if successful.
   */
  async lockForReview(id: string): Promise<boolean> {
    try {
      const affected = await prisma.animal_requests.updateMany({
        where: {
          id,
          status: "PENDING",
        },
        data: {
          status: "IN_REVIEW",
          review_started: new Date(),
        },
      });
      return affected.count > 0;
    } catch {
      return false;
    }
  },

  /**
   * Rejects a request and stores the reason.
   */
  async reject(id: string, rejectReason: string) {
    return prisma.animal_requests.update({
      where: { id },
      data: {
        status: "REJECTED",
        reject_reason: rejectReason,
        review_started: null,
      },
      select: { id: true },
    });
  },

  /**
   * Approves a request and links the approved animal.
   */
  async approve(id: string, animalId: string) {
    return prisma.animal_requests.update({
      where: { id },
      data: {
        status: "APPROVED",
        approved_animal_id: animalId,
        review_started: null,
      },
      select: { id: true },
    });
  },

  /**
   * Fetches a user by ID.
   */
  async getUserById(id: string) {
    if (!isUuid(id)) return null;
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        is_request_banned: true,
        request_banned_until: true,
      },
    });
  },

  /**
   * Manually suspends request privileges for a user.
   */
  async banUser(userId: string, isBanned: boolean, bannedUntil: Date | null = null) {
    if (!isUuid(userId)) {
      return { id: userId, is_request_banned: false, request_banned_until: null };
    }
    return prisma.user.update({
      where: { id: userId },
      data: { 
        is_request_banned: isBanned,
        request_banned_until: bannedUntil,
      },
      select: { id: true, is_request_banned: true, request_banned_until: true },
    });
  },

  /**
   * Fetches all animal classes ordered by name.
   */
  async getAllClasses() {
    return prisma.animal_class.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
  },
};
