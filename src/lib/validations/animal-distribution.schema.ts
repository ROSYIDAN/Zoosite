import { z } from "zod";

export const animalDistributionQuerySchema = z.object({
  name: z.string().min(1, "Animal name is required"),
});

export type AnimalDistributionQuery = z.infer<typeof animalDistributionQuerySchema>;

export const nativeAnimalsQuerySchema = z.object({
  countryId: z.string().uuid("Country ID must be a valid UUID"),
  status: z.enum(["ALL", "NATIVE", "ENDEMIC"]).optional().default("ALL"),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(12),
});

export type NativeAnimalsQuery = z.infer<typeof nativeAnimalsQuerySchema>;
