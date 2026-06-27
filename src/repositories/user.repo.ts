import { prisma } from "@/lib/prisma";

export const userRepo = {
  /**
   * Fetches user profile data by ID.
   */
  async getProfileById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        image_position: true,
        image_scale: true,
        role: true,
        createdAt: true,
        is_request_banned: true,
        request_banned_until: true,
        rejections_reset_at: true,
        country_id: true,
        country: {
          select: {
            id: true,
            country: true,
            country_flag: true,
          },
        },
      },
    });
  },

  /**
   * Counts contribution stats for a specific user.
   */
  async getContributionStats(id: string) {
    const [approvedCount, pendingCount, inReviewCount] = await Promise.all([
      prisma.animals.count({
        where: {
          contributed_by: id,
          is_visible: true,
        },
      }),
      prisma.animal_requests.count({
        where: {
          user_id: id,
          status: "PENDING",
        },
      }),
      prisma.animal_requests.count({
        where: {
          user_id: id,
          status: "IN_REVIEW",
        },
      }),
    ]);

    return {
      approvedCount,
      pendingCount,
      inReviewCount,
    };
  },

  /**
   * Fetches a list of approved animal profiles contributed by the user.
   */
  async getApprovedContributions(id: string) {
    return prisma.animals.findMany({
      where: {
        contributed_by: id,
        is_visible: true,
      },
      select: {
        id: true,
        animal_name: true,
        canonical_slug: true,
        animal_images: {
          take: 1,
          select: {
            image_url: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },

  /**
   * Updates display name and bio of the user.
   */
  async updateProfile(id: string, data: { name: string; bio?: string | null }) {
    return prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        bio: data.bio,
      },
      select: {
        id: true,
        name: true,
        bio: true,
      },
    });
  },

  /**
   * Updates user avatar, image_position, and image_scale.
   */
  async updateAvatar(
    id: string,
    data: { image: string; image_position?: string | null; image_scale?: number | null }
  ) {
    return prisma.user.update({
      where: { id },
      data: {
        image: data.image,
        image_position: data.image_position,
        image_scale: data.image_scale,
      },
      select: {
        id: true,
        image: true,
        image_position: true,
        image_scale: true,
      },
    });
  },

  /**
   * Finds if a given image URL matches an animal image in the conservatory archive.
   */
  async findAnimalByImageUrl(imageUrl: string) {
    const animalImage = await prisma.animal_images.findFirst({
      where: {
        image_url: imageUrl,
      },
      select: {
        animals: {
          select: {
            animal_name: true,
            canonical_slug: true,
          },
        },
      },
    });
    return animalImage?.animals || null;
  },

  /**
   * Updates the user's home/saved country.
   */
  async updateCountry(id: string, countryId: string | null) {
    return prisma.user.update({
      where: { id },
      data: {
        country_id: countryId,
      },
      select: {
        id: true,
        country_id: true,
        country: {
          select: {
            id: true,
            country: true,
            country_flag: true,
          },
        },
      },
    });
  },
};
