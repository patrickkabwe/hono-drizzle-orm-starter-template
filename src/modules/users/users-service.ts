import { UserCreatePayload } from "@/database/schemas/users";
import { Service } from "@/interfaces";
import { errorHandler } from "@/utils/errorHandler";
import { UserRepository } from "./users-repository";

export class UserService implements Service {
  constructor(public userRepo: UserRepository) {}

  async create(payload: UserCreatePayload) {
    throw new Error("Method not implemented.");
  }

  async update(userId: string, payload: UserCreatePayload) {
    try {
      const employee = await this.userRepo.update(userId, payload);
      return employee;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async delete(userId: string) {
    try {
      const employee = await this.userRepo.delete(userId);
      return employee;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findById(userId: string) {
    throw new Error("Method not implemented.");
  }

  async checkExists(userId: string) {
    try {
      const employee = await this.userRepo.findById(userId);
      return employee;
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
