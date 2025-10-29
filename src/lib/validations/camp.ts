import { z } from "zod";

export const campTypeSchema = z.enum(["day", "vacation"]);

export const campSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: campTypeSchema,
  borough: z.string().min(1, "Borough is required"),
  ageRange: z.string().min(1, "Age range is required"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  dates: z.string().min(1, "Dates are required"),
  hours: z.string().optional(),
  cost: z.string().min(1, "Cost is required"),
  financialAid: z.string().min(1, "Financial aid information is required"),
  link: z.string().url("Must be a valid URL").min(1, "Link is required"),
  phone: z.string().min(1, "Phone is required"),
  notes: z.string().min(1, "Notes are required"),
  coordinates: z
    .tuple([z.number(), z.number()])
    .refine(
      (coords) => coords[0] >= -90 && coords[0] <= 90,
      "Latitude must be between -90 and 90"
    )
    .refine(
      (coords) => coords[1] >= -180 && coords[1] <= 180,
      "Longitude must be between -180 and 180"
    ),
});

// Schema for PUT request body (camp data without name, name comes from route)
export const campUpsertSchema = campSchema.omit({ name: true });

export type Camp = z.infer<typeof campSchema>;
export type CampUpsert = z.infer<typeof campUpsertSchema>;
export type CampType = z.infer<typeof campTypeSchema>;

