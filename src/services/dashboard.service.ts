import { dashboardRepo } from "@/repositories/dashboard.repo";
import {
  toBrowseRegionItem,
  toBrowseHabitatItem,
  toExploreAnimalItem,
  toTrendingAnimalItem,
  toRecentAnimalItem,
} from "@/lib/mappers/dashboard.mapper";
import type {
  ExploreHabitatQuery,
  ExploreRegionQuery,
  StatsQuery,
  TrendingQuery,
} from "@/lib/validations/dashboard.schema";
import { checkLocalImageExists } from "@/lib/image-utils";
import { getStartOfWeek, getEndOfWeek } from "@/lib/date-utils";


export const dashboardService = {
  // ── Browse ──

  async browseRegions() {
    const raw = await dashboardRepo.getRegionsBrowse();
    return raw.map(toBrowseRegionItem);
  },

  async browseHabitats() {
    const raw = await dashboardRepo.getHabitatsBrowse();
    return raw.map(toBrowseHabitatItem);
  },

  // ── Dynamic / Classes ──

  async getClasses() {
    const classes = await dashboardRepo.getAnimalClasses();
    return Promise.all(
      classes.map(async (cls) => {
        const count = await dashboardRepo.countAnimalsByClass(cls.id);
        return {
          id: cls.id,
          name: cls.name,
          animal_count: count,
        };
      })
    );
  },

  // ── Explore ──

  async exploreHabitat(query: ExploreHabitatQuery) {
    const raw = await dashboardRepo.getAnimalsByHabitat(query.habitat);
    const filterResults = await Promise.all(
      raw.map(async (a: any) => {
        const hasImage = a.animal_images?.some((img: any) => img.image_url) || await checkLocalImageExists(a.id);
        return { a, exists: hasImage };
      })
    );
    const filtered = filterResults.filter((r) => r.exists).map((r) => r.a);
    return filtered.map((a: any) => toExploreAnimalItem(a));
  },

  async exploreRegion(query: ExploreRegionQuery) {
    const raw = await dashboardRepo.getAnimalsByRegion(query.region);
    const filterResults = await Promise.all(
      raw.map(async (a: any) => {
        const hasImage = a.animal_images?.some((img: any) => img.image_url) || await checkLocalImageExists(a.id);
        return { a, exists: hasImage };
      })
    );
    const filtered = filterResults.filter((r) => r.exists).map((r) => r.a);
    return filtered.map((a: any) => toExploreAnimalItem(a, query.region));
  },

  // ── Stats ──

  async getStatsAnimalsLived(query: StatsQuery) {
    let count = 0;
    if (query.region) {
      count = await dashboardRepo.countAnimalsLivedByRegion(query.region);
    } else if (query.habitat) {
      count = await dashboardRepo.countAnimalsLivedByHabitat(query.habitat);
    }
    return { count };
  },

  async getStatsTotals() {
    return dashboardRepo.getTotals();
  },

  // ── Recent Animals (New This Week) ──

  async getRecentAnimals(limit = 6) {
    const now = new Date();
    const since = getStartOfWeek(now);

    // Fetch more than needed so we can filter out animals without images
    const raw = await dashboardRepo.getRecentAnimals(since, limit * 3);

    const withImages = await Promise.all(
      raw.map(async (a: any) => {
        const hasImage =
          a.animal_images?.some((img: any) => img.image_url) ||
          await checkLocalImageExists(a.id);
        return { a, hasImage };
      })
    );

    const filtered = withImages
      .filter((r) => r.hasImage)
      .map((r) => r.a)
      .slice(0, limit);

    return {
      items: filtered.map((a: any) => toRecentAnimalItem(a)),
      weekStart: getStartOfWeek(now),
      weekEnd: getEndOfWeek(now),
    };
  },

  // ── Trending ──

  async getTrending(query: TrendingQuery) {
    const randomIds = await dashboardRepo.getRandomAnimalIds(50);
    if (randomIds.length === 0) return [];

    const animalsWithImages = await dashboardRepo.getAnimalsWithImages(randomIds.map(r => r.id));

    const validIds: string[] = [];
    const fallbackIds: string[] = [];

    for (const row of randomIds) {
      const animal = animalsWithImages.find(a => a.id === row.id);
      const hasImage = animal?.animal_images?.some((img: any) => img.image_url) || await checkLocalImageExists(row.id);

      if (hasImage) {
        if (validIds.length < 10) {
          validIds.push(row.id);
        }
      } else {
        fallbackIds.push(row.id);
      }
    }

    // Fallback: if we have fewer than 10 animals with images, fill the remaining slots with other random animals
    while (validIds.length < 10 && fallbackIds.length > 0) {
      const fallbackId = fallbackIds.shift();
      if (fallbackId) {
        validIds.push(fallbackId);
      }
    }

    if (validIds.length === 0) return [];

    const raw = await dashboardRepo.getTrendingAnimals(validIds, query.detail);
    
    return raw.map((a: any) => toTrendingAnimalItem(a, query.detail));
  },
};
