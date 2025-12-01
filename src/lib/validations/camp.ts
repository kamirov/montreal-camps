import { z } from "zod";

// Age range schema: either all ages or a range
export const ageRangeSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("all"),
    allAges: z.literal(true),
  }),
  z
    .object({
      type: z.literal("range"),
      allAges: z.literal(false),
      from: z.number().int().positive("From age must be positive"),
      to: z.number().int().positive("To age must be positive"),
    })
    .refine((data) => data.to >= data.from, {
      message: "To age must be greater than or equal to from age",
      path: ["to"],
    }),
]);

// Dates schema: either year round or a date range
export const datesSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("yearRound"),
    yearRound: z.literal(true),
  }),
  z
    .object({
      type: z.literal("range"),
      yearRound: z.literal(false),
      fromDate: z
        .string()
        .regex(
          /^\d{4}-\d{2}-\d{2}$/,
          "From date must be in ISO format (YYYY-MM-DD)"
        ),
      toDate: z
        .string()
        .regex(
          /^\d{4}-\d{2}-\d{2}$/,
          "To date must be in ISO format (YYYY-MM-DD)"
        ),
    })
    .refine(
      (data) => {
        const from = new Date(data.fromDate);
        const to = new Date(data.toDate);
        return !isNaN(from.getTime()) && !isNaN(to.getTime()) && to >= from;
      },
      {
        message: "To date must be greater than or equal to from date",
        path: ["toDate"],
      }
    ),
]);

// Phone schema: formatted number and optional extension
// Phone is optional, but if provided, number can be empty string
export const phoneSchema = z
  .object({
    number: z.string(),
    extension: z.string().optional(),
  })
  .optional();

export const campSchema = z.object({
  name: z.string().min(1, "Name is required"),
  borough: z.string().min(1, "Borough is required"),
  ageRange: ageRangeSchema,
  languages: z.array(z.string()).min(1, "At least one language is required"),
  dates: datesSchema,
  financialAid: z.string().min(1, "Financial aid information is required"),
  link: z
    .union([
      z.string().url("Must be a valid URL"),
      z.literal(""),
      z.undefined(),
    ])
    .optional(),
  phone: phoneSchema,
  email: z
    .union([z.string().email("Must be a valid email address"), z.literal("")])
    .optional(),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  notes: z.string().optional(),
});

// Schema for PUT request body (camp data without name, name comes from route)
export const campUpsertSchema = campSchema.omit({ name: true });

export type Camp = z.infer<typeof campSchema>;
export type CampUpsert = z.infer<typeof campUpsertSchema>;
