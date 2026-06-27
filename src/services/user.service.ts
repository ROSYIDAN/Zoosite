import { userRepo } from "@/repositories/user.repo";
import { animalRequestRepo } from "@/repositories/animal-request.repo";
import { AppError } from "@/lib/errors";
import {
  updateProfileSchema,
  updateCountrySchema,
  type UpdateProfileInput,
  type UpdateCountryInput,
} from "@/lib/validations/user.schema";

export const userService = {
  /**
   * Retrieves unified profile data for a specific user, combining profile details,
   * contribution stats, and approved contribution items.
   */
  async getProfileData(userId: string) {
    const user = await userRepo.getProfileById(userId);
    if (!user) {
      throw new AppError("User profile not found", 404);
    }

    const [stats, approvedContributions, rejectionCount, avatarAnimal] = await Promise.all([
      userRepo.getContributionStats(userId),
      userRepo.getApprovedContributions(userId),
      animalRequestRepo.getRejectionCount(userId),
      user.image ? userRepo.findAnimalByImageUrl(user.image) : null,
    ]);

    // Format approved contributions to flatten image
    const contributions = approvedContributions.map((animal) => ({
      id: animal.id,
      animal_name: animal.animal_name,
      canonical_slug: animal.canonical_slug,
      image_url: animal.animal_images[0]?.image_url || null,
    }));

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        bio: user.bio,
        image_position: user.image_position,
        image_scale: user.image_scale,
        role: user.role,
        createdAt: user.createdAt,
        is_request_banned: user.is_request_banned,
        request_banned_until: user.request_banned_until,
        rejections_reset_at: user.rejections_reset_at,
        country_id: user.country_id,
        country: user.country,
      },
      stats: {
        approvedCount: stats.approvedCount,
        pendingCount: stats.pendingCount,
        inReviewCount: stats.inReviewCount,
        rejectionCount,
      },
      approvedContributions: contributions,
      avatarAnimal,
    };
  },

  /**
   * Updates the authenticated user's name and bio after validation.
   */
  async updateProfile(userId: string, input: UpdateProfileInput) {
    const validated = updateProfileSchema.safeParse(input);
    if (!validated.success) {
      throw new AppError(validated.error.issues[0]?.message || "Invalid input", 400);
    }

    const user = await userRepo.getProfileById(userId);
    if (!user) {
      throw new AppError("User profile not found", 404);
    }

    return userRepo.updateProfile(userId, {
      name: validated.data.name,
      bio: validated.data.bio || null,
    });
  },

  /**
   * Updates the authenticated user's profile avatar details.
   */
  async updateAvatar(
    userId: string,
    input: { image: string; image_position?: string | null; image_scale?: number | null }
  ) {
    if (!input.image || typeof input.image !== "string") {
      throw new AppError("Invalid image URL", 400);
    }

    const user = await userRepo.getProfileById(userId);
    if (!user) {
      throw new AppError("User profile not found", 404);
    }

    return userRepo.updateAvatar(userId, {
      image: input.image,
      image_position: input.image_position || "50% 50%",
      image_scale: input.image_scale !== undefined ? input.image_scale : 1.0,
    });
  },

  /**
   * Updates the authenticated user's home country.
   */
  async updateCountry(userId: string, input: UpdateCountryInput) {
    const validated = updateCountrySchema.safeParse(input);
    if (!validated.success) {
      throw new AppError(validated.error.issues[0]?.message || "Invalid input", 400);
    }

    const user = await userRepo.getProfileById(userId);
    if (!user) {
      throw new AppError("User profile not found", 404);
    }

    const countryId = validated.data.countryId || null;
    return userRepo.updateCountry(userId, countryId);
  },
};
