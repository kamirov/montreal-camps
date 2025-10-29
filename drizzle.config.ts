import { defineConfig } from "drizzle-kit";

if (!process.env.PGHOST_UNPOOLED) {
  throw new Error("PGHOST_UNPOOLED environment variable is not set");
}
if (!process.env.PGUSER) {
  throw new Error("PGUSER environment variable is not set");
}
if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE environment variable is not set");
}
if (!process.env.PGPASSWORD) {
  throw new Error("PGPASSWORD environment variable is not set");
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.PGHOST_UNPOOLED,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
  },
});

