import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const DB_URL = process.env.DATABASE_URL ?? process.env.TEST_DATABASE_URL ?? "";

console.log("DB_URL", DB_URL);

// for migrations
export const migrationClient = postgres(DB_URL, { max: 1 });

// for query purposes
export const pgQueryClient = postgres(DB_URL);
export const db = drizzle(pgQueryClient, {
  logger: process.env.NODE_ENV === "development" ? true : undefined,
});
