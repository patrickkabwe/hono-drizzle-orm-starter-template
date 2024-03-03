import { UserCreatePayload } from "@/database/schemas/users";
import { Repository } from "@/interfaces";

export class UserRepository implements Repository {
  create(payload: UserCreatePayload) {
    throw new Error("Method not implemented.");
  }

  delete(id: string) {
    throw new Error("Method not implemented.");
  }

  update(id: string, payload: any) {
    throw new Error("Method not implemented.");
  }

  findOne(filter: any) {
    throw new Error("Method not implemented.");
  }

  find(filter: any) {
    throw new Error("Method not implemented.");
  }

  findById(id: string) {
    throw new Error("Method not implemented.");
  }

  deleteMany(filter: any) {
    throw new Error("Method not implemented.");
  }

  updateMany(filter: any, payload: any) {
    throw new Error("Method not implemented.");
  }

  count(filter: any) {
    throw new Error("Method not implemented.");
  }
}
