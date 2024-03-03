import { db } from "@/database";
import { User, UserCreatePayload, users } from "@/database/schemas/users";
import { Repository } from "@/interfaces";
import { drizzleFilterQuery } from "@/utils/drizzle-filter-query";
import { count, eq } from "drizzle-orm";

export class UserRepository implements Repository {
  async create(payload: UserCreatePayload) {
    const rows = await db.insert(users).values(payload).returning();
    return rows[0];
  }

  async delete(id: string) {
    return await db.delete(users).where(eq(users.id, id));
  }

  async update(id: string, payload: any) {
    const rows = await db.update(users).set(payload).where(eq(users.id, id));
    return rows[0];
  }

  async findOne(filter?: Partial<User>) {
    const rows = await db
      .select()
      .from(users)
      .where(drizzleFilterQuery(users, filter));

    return rows[0];
  }

  async find(filter?: Partial<User>) {
    const rows = await db
      .select()
      .from(users)
      .where(drizzleFilterQuery(users, filter));

    return rows;
  }

  async findById(id: string) {
    return await this.findOne({ id });
  }

  async exists(filter?: Partial<User>) {
    const rows = await db
      .select()
      .from(users)
      .where(drizzleFilterQuery(users, filter))

    return rows[0]
  }

  async deleteMany() {
    const rows = await db.delete(users);
    return rows;
  }

  async updateMany(payload: any, filter?: any) {
    const rows = await db
      .update(users)
      .set(payload)
      .where(drizzleFilterQuery(users, filter));

    return rows;
  }

  async count() {
    const rows = await db
      .select({
        value: count(),
      })
      .from(users);

    return rows[0].value;
  }
}
