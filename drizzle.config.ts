import type { Config } from "drizzle-kit";

export default {
  schema: "./app/database/schemas/**.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  },
  strict: process.env.NODE_ENV === "production" ? true : false,
  verbose: true,
} satisfies Config;
