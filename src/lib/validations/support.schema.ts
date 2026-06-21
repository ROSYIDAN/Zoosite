import { z } from "zod";

export const supportSubjectEnum = [
  "General Inquiry",
  "Bug Report",
  "Feature Suggestion",
  "Contributory Unlock Help",
] as const;

export const supportSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .trim(),
  subject: z.enum(supportSubjectEnum, {
    message: "Please select a valid subject category",
  }),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters")
    .trim(),
});

export type SupportInput = z.infer<typeof supportSchema>;
