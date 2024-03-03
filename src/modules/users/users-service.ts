import { UserCreatePayload } from "@/database/schemas/users";
import { Service } from "@/interfaces";
import { errorHandler } from "@/utils/errorHandler";
import { UserRepository } from "./users-repository";

export class UserService implements Service {
  constructor(public userRepo: UserRepository) {}

  async create(payload: UserCreatePayload) {
    try {
      const employee = await this.userRepo.create(payload);
      return employee;
    } catch (error) {
      throw errorHandler(error);
    }
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
    try {
      const employee = await this.userRepo.findById(userId);
      return employee;
    } catch (error) {
      throw errorHandler(error);
    }
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
