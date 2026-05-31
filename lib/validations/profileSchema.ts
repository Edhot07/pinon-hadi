// lib/validations/profileSchema.ts
import { z } from "zod";

export const addressSchema = z.object({
  addressLine: z.string().min(1, "Street address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  subdivision: z.string().optional(), // ← state/province
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

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

export type AddressValues = z.infer<typeof addressSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
