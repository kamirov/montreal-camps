import { z } from "zod";

export const campTypeSchema = z.enum(["day", "vacation"]);

export const costPeriodSchema = z.enum(["year", "month", "week", "hour"]);

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

// Cost schema: amount and period
export const costSchema = z.object({
  amount: z.number().positive("Cost amount must be positive"),
  period: costPeriodSchema,
});

// Phone schema: formatted number and optional extension
export const phoneSchema = z.object({
  number: z.string().min(1, "Phone number is required"),
  extension: z.string().optional(),
});

export const campSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    type: campTypeSchema,
    borough: z.string().nullable(),
    ageRange: ageRangeSchema,
    languages: z.array(z.string()).min(1, "At least one language is required"),
    dates: datesSchema,
    hours: z.string().optional(),
    cost: costSchema,
    financialAid: z.string().min(1, "Financial aid information is required"),
    link: z.string().url("Must be a valid URL").min(1, "Link is required"),
    phone: phoneSchema,
    email: z
      .union([z.string().email("Must be a valid email address"), z.literal("")])
      .optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      // Day camps must have a borough
      if (data.type === "day") {
        return data.borough !== null && data.borough.trim().length > 0;
      }
      // Vacation camps must NOT have a borough
      if (data.type === "vacation") {
        return data.borough === null;
      }
      return true;
    },
    {
      message: "Day camps require a borough; vacation camps must not have one",
      path: ["borough"],
    }
  );

// Schema for PUT request body (camp data without name, name comes from route)
export const campUpsertSchema = campSchema.omit({ name: true });

export type Camp = z.infer<typeof campSchema>;
export type CampUpsert = z.infer<typeof campUpsertSchema>;
export type CampType = z.infer<typeof campTypeSchema>;
