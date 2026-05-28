import { z } from "zod";

export const animalDistributionQuerySchema = z.object({
  name: z.string().min(1, "Animal name is required"),
});

export type AnimalDistributionQuery = z.infer<typeof animalDistributionQuerySchema>;
