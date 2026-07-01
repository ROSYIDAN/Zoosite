import { z } from "zod";

export const animalDistributionQuerySchema = z.object({
  name: z.string().min(1, "Animal name is required"),
});

export type AnimalDistributionQuery = z.infer<typeof animalDistributionQuerySchema>;

export const nativeAnimalsQuerySchema = z.object({
  countryId: z.string().uuid("Country ID must be a valid UUID"),
  status: z.enum(["ALL", "NATIVE", "ENDEMIC"]).optional().default("ALL"),
  search: z.string().optional(),
  region: z.string().optional(),
  province: z.string().optional(),
  locality: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(12),
  sortBy: z.enum(["name", "newest"]).optional().default("name"),
});

export type NativeAnimalsQuery = z.input<typeof nativeAnimalsQuerySchema>;
