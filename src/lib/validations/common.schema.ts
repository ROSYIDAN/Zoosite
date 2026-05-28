import { z } from "zod";

export const limitQuerySchema = z.object({
  limit: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number().int().min(1).max(100).optional().default(10)
  ),
});

export type LimitQueryInput = z.infer<typeof limitQuerySchema>;
