import { jsonb, numeric, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const camps = pgTable("camps", {
  name: varchar("name", { length: 255 }).primaryKey(),
  borough: varchar("borough", { length: 255 }).notNull(),
  ageRange: jsonb("age_range").notNull(), // {allAges: boolean, from?: number, to?: number}
  languages: text("languages").array().notNull(),
  dates: jsonb("dates").notNull(), // {yearRound: boolean, fromDate?: string (ISO date), toDate?: string (ISO date)}
  financialAid: varchar("financial_aid", { length: 500 }).notNull(),
  link: varchar("link", { length: 500 }), // Optional website
  phone: varchar("phone", { length: 50 }), // Optional formatted phone number
  phoneExtension: varchar("phone_extension", { length: 20 }), // Optional extension
  email: varchar("email", { length: 255 }), // Optional email address
  address: varchar("address", { length: 500 }), // Optional address
  latitude: numeric("latitude", { precision: 10, scale: 7 }), // Optional latitude coordinate
  longitude: numeric("longitude", { precision: 10, scale: 7 }), // Optional longitude coordinate
  notes: text("notes"), // Made nullable
});
