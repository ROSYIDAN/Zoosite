import { dashboardRepo } from "@/repositories/dashboard.repo";
import {
  toBrowseRegionItem,
  toBrowseHabitatItem,
  toExploreAnimalItem,
  toTrendingAnimalItem,
} from "@/lib/mappers/dashboard.mapper";
import type {
  ExploreHabitatQuery,
  ExploreRegionQuery,
  StatsQuery,
  TrendingQuery,
} from "@/lib/validations/dashboard.schema";
import { checkLocalImageExists } from "@/lib/image-utils";


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
        const hasImgbb = a.animal_images?.some((img: any) => img.image_url?.includes("ibb.co"));
        const exists = hasImgbb || await checkLocalImageExists(a.id);
        return { a, exists };
      })
    );
    const filtered = filterResults.filter((r) => r.exists).map((r) => r.a);
    return filtered.map((a: any) => toExploreAnimalItem(a));
  },

  async exploreRegion(query: ExploreRegionQuery) {
    const raw = await dashboardRepo.getAnimalsByRegion(query.region);
    const filterResults = await Promise.all(
      raw.map(async (a: any) => {
        const hasImgbb = a.animal_images?.some((img: any) => img.image_url?.includes("ibb.co"));
        const exists = hasImgbb || await checkLocalImageExists(a.id);
        return { a, exists };
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

  // ── Trending ──

  async getTrending(query: TrendingQuery) {
    const randomIds = await dashboardRepo.getRandomAnimalIds(50);
    if (randomIds.length === 0) return [];

    const animalsWithImages = await dashboardRepo.getAnimalsWithImages(randomIds.map(r => r.id));

    const validIds: string[] = [];

    for (const row of randomIds) {
      const animal = animalsWithImages.find(a => a.id === row.id);
      const hasImgbb = animal?.animal_images?.some((img: any) => img.image_url?.includes("ibb.co"));
      const exists = hasImgbb || await checkLocalImageExists(row.id);

      if (exists) {
        validIds.push(row.id);
      }
      
      if (validIds.length === 10) {
        break;
      }
    }

    if (validIds.length === 0) return [];

    const raw = await dashboardRepo.getTrendingAnimals(validIds, query.detail);
    
    return raw.map((a: any) => toTrendingAnimalItem(a, query.detail));
  },
};
