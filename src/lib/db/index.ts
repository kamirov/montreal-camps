import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.PGHOST) {
  throw new Error("PGHOST environment variable is not set");
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

// Use pooled connection for queries
const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}`;

const client = postgres(connectionString, {
  max: 1, // Connection pool size
});

export const db = drizzle(client, { schema });
export type Database = typeof db;

