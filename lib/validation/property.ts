import { z } from "zod";
import { PROPERTY_TYPES } from "@/types/property";

export const propertyInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  propertyType: z.enum(PROPERTY_TYPES, { message: "Select a property type" }),
  address: z
    .string()
    .trim()
    .max(200, "Address must be 200 characters or fewer")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes must be 1000 characters or fewer")
    .optional()
    .or(z.literal("")),
});

export type PropertyInput = z.infer<typeof propertyInputSchema>;
