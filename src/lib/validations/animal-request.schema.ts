import { z } from "zod";

export const requestAnimalSchema = z.object({
  request_type: z.enum(["QUICK", "FULL_DETAIL"]),
  animal_name: z.string().min(1, "Common name is required"),
  image_url: z.string().url("Please provide a valid image URL").optional().nullable(),
  image_public_id: z.string().optional().nullable(),

  // ── Optional for QUICK, but used for FULL_DETAIL ──
  scientific_name: z.string().optional().nullable(),
  synonyms: z.string().optional().nullable(),
  family: z.string().optional().nullable(),
  genus: z.string().optional().nullable(),
  ordo: z.string().optional().nullable(),
  class_id: z.string().uuid("Please select a valid animal class").optional().nullable().or(z.literal("")),
  description: z.string().optional().nullable(),
  description_source: z.string().optional().nullable(),
  diet: z.string().optional().nullable(),
  lifespan_years: z.string().optional().nullable(),
  weight_kg: z.string().optional().nullable(),
  height_cm: z.string().optional().nullable(),
  avg_speed_kmh: z.string().optional().nullable(),
  top_speed_kmh: z.string().optional().nullable(),
  social_structure: z.string().optional().nullable(),
  conservation_status: z.string().optional().nullable(),
  predators: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  countries: z.array(z.string()).optional().nullable(),
  habitats: z.array(z.string()).optional().nullable(),
});

export const updateRequestSchema = requestAnimalSchema.partial();

export const rejectRequestSchema = z.object({
  reject_reason: z.string().min(1, "Rejection reason is required"),
});

export type RequestAnimalInput = z.infer<typeof requestAnimalSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
