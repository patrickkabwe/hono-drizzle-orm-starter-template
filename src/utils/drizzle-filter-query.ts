import { eq } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

export const drizzleFilterQuery = <T>(table: T, filter?: Record<any, any>) => {
  if (!filter) return undefined;
  return Object.entries(filter).map(([key, value]) => {
    const _key = table[key as keyof typeof table] as PgColumn;
    return eq(_key, value);
  }) as any;
};
