import { z } from "zod";

// ── Query params for GET /api/animals ──
export const listAnimalsQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .pipe(z.number().int().positive().optional()),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .pipe(z.number().int().positive()),
  diet: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["name", "scientific_name", "created_at"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

// ── Body for POST /api/animals ──
export const createAnimalSchema = z.object({
  name: z.string().min(1, "Common name is required"),
  scientific_name: z.string().min(1, "Scientific name is required"),
  family: z.string().optional(),
  genus: z.string().optional(),
  ordo: z.string().optional(),
  class_id: z.string().uuid("Please select a valid animal class").optional(),
  description: z.string().min(10, "Description should be at least 10 characters").optional(),
  description_source: z
    .string()
    .url("Please provide a valid URL")
    .optional()
    .or(z.literal("")),
  image: z.string().url("Please provide a valid image URL").optional(),
  image_source: z.string().optional(),
  diet: z.string().optional(),
  lifespan_years: z.string().optional(),
  weight_kg: z.string().optional(),
  height_cm: z.string().optional(),
  avg_speed_kmh: z.string().optional(),
  top_speed_kmh: z.string().optional(),
  social_structure: z.string().optional(),
  conservation_status: z.string().optional(),
  predators: z.string().optional(),
  tags: z.array(z.string()).optional(),
  countries: z.array(z.string()).optional(),
  habitats: z.array(z.string()).optional(),
});

// ── Route param for GET /api/animals/[slug] ──
export const slugParamSchema = z.object({
  slug: z.string().min(1, "slug is required"),
});

// ── Route param for GET /api/animals/[id]/imgbb ──
export const idParamSchema = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});

// ── Inferred types ──
export type ListAnimalsQuery = z.infer<typeof listAnimalsQuerySchema>;
export type CreateAnimalInput = z.infer<typeof createAnimalSchema>;
