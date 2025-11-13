import { jsonb, numeric, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const camps = pgTable("camps", {
  name: varchar("name", { length: 255 }).primaryKey(),
  type: varchar("type", { length: 20 }).notNull(),
  borough: varchar("borough", { length: 255 }), // Nullable for vacation camps
  ageRange: jsonb("age_range").notNull(), // {allAges: boolean, from?: number, to?: number}
  languages: text("languages").array().notNull(),
  dates: jsonb("dates").notNull(), // {yearRound: boolean, fromDate?: string (ISO date), toDate?: string (ISO date)}
  hours: varchar("hours", { length: 255 }),
  costAmount: numeric("cost_amount", { precision: 10, scale: 2 }).notNull(),
  costPeriod: varchar("cost_period", { length: 20 }).notNull(), // year, month, week, hour
  financialAid: varchar("financial_aid", { length: 500 }).notNull(),
  link: varchar("link", { length: 500 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(), // Formatted phone number
  phoneExtension: varchar("phone_extension", { length: 20 }), // Optional extension
  notes: text("notes"), // Made nullable
});
