import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { logger } from "@/lib/logger";
import { migrationClient } from ".";

migrate(drizzle(migrationClient), {
  migrationsFolder: "./drizzle",
})
  .then(() => {
    logger.info("Migrations ran successfully");
    process.exit(0);
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  })
  .finally(() => {
    migrationClient.end();
  });
