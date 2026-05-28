import { animalRequestRepo } from "@/repositories/animal-request.repo";
import { animalRepo } from "@/repositories/animal.repo";
import { cloudinary } from "@/lib/cloudinary";
import { AppError } from "@/lib/errors";
import type { RequestAnimalInput, UpdateRequestInput } from "@/lib/validations/animal-request.schema";

export const animalRequestService = {
  /**
   * Checks if an animal exists or is currently being reviewed.
   */
  async checkDuplicate(name: string) {
    const trimmed = name.trim();
    if (!trimmed) {
      return { exists: false, isUnderReview: false };
    }

    const duplicateAnimal = await animalRequestRepo.checkDuplicateAnimal(trimmed);
    if (duplicateAnimal) {
      return { exists: true, isUnderReview: false, animal: duplicateAnimal };
    }

    const activeRequest = await animalRequestRepo.checkActiveRequest(trimmed);
    if (activeRequest) {
      return { exists: false, isUnderReview: true, request: activeRequest };
    }

    return { exists: false, isUnderReview: false };
  },

  /**
   * Creates a new request submitted by an authenticated user.
   */
  async createRequest(input: RequestAnimalInput, userId: string) {
    // 1. Get requester and verify ban status
    const user = await animalRequestRepo.getUserById(userId);
    if (!user) {
      throw new AppError("Requester user not found", 404);
    }
    if (user.is_request_banned) {
      throw new AppError("Your request privileges have been suspended permanently.", 403);
    }
    if (user.request_banned_until && user.request_banned_until > new Date()) {
      const dateStr = new Date(user.request_banned_until).toLocaleDateString();
      throw new AppError(`Your request privileges have been suspended until ${dateStr}.`, 403);
    }

    // 2. Prevent active duplicate submissions
    const check = await this.checkDuplicate(input.animal_name);
    if (check.exists) {
      throw new AppError("This animal already exists in the database.", 409);
    }
    if (check.isUnderReview) {
      throw new AppError("There is already a pending request for this animal.", 409);
    }

    // 3. Create request
    return await animalRequestRepo.create(input, userId);
  },

  /**
   * Fetches a user's request history and total rejection count.
   */
  async getUserHistory(userId: string) {
    const requests = await animalRequestRepo.findByUserId(userId);
    const rejectionCount = await animalRequestRepo.getRejectionCount(userId);
    return { requests, rejectionCount };
  },

  /**
   * Updates a pending request (User Edit).
   */
  async updateRequest(id: string, input: UpdateRequestInput, userId: string) {
    const request = await animalRequestRepo.findById(id);
    if (!request) {
      throw new AppError("Request not found", 404);
    }

    if (request.user_id !== userId) {
      throw new AppError("You do not have permission to edit this request.", 403);
    }

    const user = await animalRequestRepo.getUserById(userId);
    if (user) {
      if (user.is_request_banned) {
        throw new AppError("Your request privileges have been suspended permanently.", 403);
      }
      if (user.request_banned_until && user.request_banned_until > new Date()) {
        const dateStr = new Date(user.request_banned_until).toLocaleDateString();
        throw new AppError(`Your request privileges have been suspended until ${dateStr}.`, 403);
      }
    }

    // Concurrency Lock Check
    if (request.status !== "PENDING") {
      throw new AppError("This request is currently under review and cannot be edited.", 409);
    }

    // Cloudinary Housekeeping: Delete old temp image if a new image was uploaded
    if (input.image_url && input.image_url !== request.image_url && request.image_public_id) {
      await cloudinary.uploader.destroy(request.image_public_id).catch((err) => {
        console.error("Failed to delete stale temp image from Cloudinary:", err);
      });
    }

    return await animalRequestRepo.update(id, input);
  },

  /**
   * Withdraws (deletes) a pending request.
   */
  async withdrawRequest(id: string, userId: string) {
    const request = await animalRequestRepo.findById(id);
    if (!request) {
      throw new AppError("Request not found", 404);
    }

    if (request.user_id !== userId) {
      throw new AppError("You do not have permission to withdraw this request.", 403);
    }

    // Concurrency Lock Check
    if (request.status !== "PENDING") {
      throw new AppError("This request is currently under review and cannot be withdrawn.", 409);
    }

    // Delete image from Cloudinary temp directory
    if (request.image_public_id) {
      await cloudinary.uploader.destroy(request.image_public_id).catch((err) => {
        console.error("Failed to delete temp image from Cloudinary on withdrawal:", err);
      });
    }

    return await animalRequestRepo.delete(id);
  },

  /**
   * Lists all requests for the admin.
   */
  async listAdminRequests() {
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    // Auto-revert abandoned review locks
    await animalRequestRepo.revertAbandonedLocks(thirtyMinsAgo);
    return await animalRequestRepo.listAllForAdmin();
  },

  /**
   * Locks the request for review.
   */
  async lockRequest(id: string) {
    const locked = await animalRequestRepo.lockForReview(id);
    if (!locked) {
      throw new AppError("This request is no longer pending or is locked by another admin.", 409);
    }
  },

  /**
   * Unlocks the request, cancelling active review.
   */
  async unlockRequest(id: string) {
    return await animalRequestRepo.unlock(id);
  },

  /**
   * Rejects a request and stores the reason.
   */
  async rejectRequest(id: string, rejectReason: string) {
    const request = await animalRequestRepo.findById(id);
    if (!request) {
      throw new AppError("Request not found", 404);
    }

    // Cloudinary Housekeeping: Delete temp image since it was rejected
    if (request.image_public_id) {
      await cloudinary.uploader.destroy(request.image_public_id).catch((err) => {
        console.error("Failed to delete temp image from Cloudinary on rejection:", err);
      });
    }

    return await animalRequestRepo.reject(id, rejectReason);
  },

  /**
   * Approves a request and creates the animal profile.
   */
  async approveRequest(id: string, approvedFields: any) {
    const request = await animalRequestRepo.findById(id);
    if (!request) {
      throw new AppError("Request not found", 404);
    }

    // 1. Create animal in database using existing standard repo method
    const animalInput = {
      name: approvedFields.name || request.animal_name,
      scientific_name: approvedFields.scientific_name || "",
      synonyms: approvedFields.synonyms || request.synonyms || undefined,
      family: approvedFields.family || undefined,
      genus: approvedFields.genus || undefined,
      ordo: approvedFields.ordo || undefined,
      class_id: approvedFields.class_id || undefined,
      description: approvedFields.description || undefined,
      description_source: approvedFields.description_source || undefined,
      image: approvedFields.image || request.image_url || undefined,
      image_source: approvedFields.image_source || undefined,
      diet: approvedFields.diet || undefined,
      lifespan_years: approvedFields.lifespan_years || undefined,
      weight_kg: approvedFields.weight_kg || undefined,
      height_cm: approvedFields.height_cm || undefined,
      avg_speed_kmh: approvedFields.avg_speed_kmh || undefined,
      top_speed_kmh: approvedFields.top_speed_kmh || undefined,
      social_structure: approvedFields.social_structure || undefined,
      conservation_status: approvedFields.conservation_status || undefined,
      predators: approvedFields.predators || undefined,
      tags: approvedFields.tags || [],
      countries: approvedFields.countries || [],
      habitats: approvedFields.habitats || [],
      contributed_by: request.user_id, // Attributed contribution here atomically
    };

    // Resolve tag names to UUIDs (tags from the form are names like "Reptile", not UUIDs)
    if (animalInput.tags && animalInput.tags.length > 0) {
      const { tagRepo } = await import("@/repositories/tag.repo");
      const dbTags = await tagRepo.findOrCreate(animalInput.tags);
      animalInput.tags = dbTags.map((t: { id: string }) => t.id);
    }

    const animal = await animalRepo.createWithRelations(animalInput);

    // 2. Mark request as APPROVED
    await animalRequestRepo.approve(id, animal.id);

    return animal;
  },

  /**
   * Manually suspends request privileges for a user.
   */
  async banUser(userId: string, isBanned: boolean, durationDays?: number) {
    let bannedUntil: Date | null = null;
    if (isBanned && durationDays && durationDays > 0) {
      bannedUntil = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
    }
    return await animalRequestRepo.banUser(userId, isBanned, bannedUntil);
  },

  /**
   * Fetches all initialization data needed for the animal request submission page.
   */
  async getSubmissionPageData(userId: string) {
    const classes = await animalRequestRepo.getAllClasses();
    const user = await animalRequestRepo.getUserById(userId);
    const rejectionCount = await animalRequestRepo.getRejectionCount(userId);

    const isBanned = !!(
      user?.is_request_banned ||
      (user?.request_banned_until && new Date(user.request_banned_until) > new Date())
    );

    return { classes, rejectionCount, isBanned };
  },
};
