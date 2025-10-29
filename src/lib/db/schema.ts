import { pgTable, varchar, text, numeric } from "drizzle-orm/pg-core";

export const camps = pgTable("camps", {
  name: varchar("name", { length: 255 }).primaryKey(),
  type: varchar("type", { length: 20 }).notNull(),
  borough: varchar("borough", { length: 255 }).notNull(),
  ageRange: varchar("age_range", { length: 100 }).notNull(),
  languages: text("languages").array().notNull(),
  dates: varchar("dates", { length: 255 }).notNull(),
  hours: varchar("hours", { length: 255 }),
  cost: varchar("cost", { length: 255 }).notNull(),
  financialAid: varchar("financial_aid", { length: 500 }).notNull(),
  link: varchar("link", { length: 500 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  notes: text("notes").notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: numeric("longitude", { precision: 10, scale: 7 }).notNull(),
});

