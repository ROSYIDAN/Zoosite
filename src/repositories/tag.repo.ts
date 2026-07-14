import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export const tagRepo = {
  /**
   * Fetch all available tags.
   */
  async findAll() {
    return prisma.tags.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
      },
    });
  },

  /**
   * Ensure tags exist in the DB and return their IDs.
   * If a tag doesn't exist, it creates it.
   */
  async findOrCreate(names: string[]) {
    if (!names || names.length === 0) return [];

    const tagsIds: { id: string }[] = [];

    // Note: We use a loop here instead of Prisma's `createManyAndReturn`
    // to properly handle slugification and avoid unique constraint errors
    // if two admins add the same tag concurrently.
    for (const name of names) {
      const slug = slugify(name);
      
      const tag = await prisma.tags.upsert({
        where: { slug },
        update: {}, // Do nothing if it exists
        create: {
          name: name.trim(),
          slug,
        },
        select: { id: true },
      });
      
      tagsIds.push(tag);
    }

    return tagsIds;
  },

  /**
   * Connect tags to an animal inside a transaction.
   */
  async connectTags(
    tx: Prisma.TransactionClient,
    animalId: string,
    tagIds: string[]
  ) {
    if (tagIds.length === 0) return null;
    return tx.animals.update({
      where: { id: animalId },
      data: {
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
    });
  },

  /**
   * Sync tags for an animal inside a transaction.
   */
  async syncTags(
    tx: Prisma.TransactionClient,
    animalId: string,
    tagIds: string[]
  ) {
    return tx.animals.update({
      where: { id: animalId },
      data: {
        tags: {
          set: tagIds.map((id) => ({ id })),
        },
      },
    });
  },
};
