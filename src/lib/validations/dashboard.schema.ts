import { z } from "zod";

export const exploreHabitatQuerySchema = z.object({
  habitat: z.string().min(1, "Habitat parameter is required"),
});

export const exploreRegionQuerySchema = z.object({
  region: z.string().min(1, "Region parameter is required"),
});

export const statsQuerySchema = z.object({
  region: z.string().optional(),
  habitat: z.string().optional(),
}).refine((data) => data.region || data.habitat, {
  message: "Provide a region or habitat parameter",
});

export const trendingQuerySchema = z.object({
  detail: z.string().optional(),
});

export type ExploreHabitatQuery = z.infer<typeof exploreHabitatQuerySchema>;
export type ExploreRegionQuery = z.infer<typeof exploreRegionQuerySchema>;
export type StatsQuery = z.infer<typeof statsQuerySchema>;
export type TrendingQuery = z.infer<typeof trendingQuerySchema>;
