// lib/validations/profileSchema.ts
import { z } from "zod";

export const profileSchema = z.object({
  nickname: z
    .string()
    .min(2, "Nickname must be at least 2 characters")
    .max(50, "Nickname too long"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z.string().max(50, "Last name too long").optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{10,15}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
