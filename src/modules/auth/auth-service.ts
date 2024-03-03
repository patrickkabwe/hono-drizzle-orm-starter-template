import {
  UserCreatePayload,
  UserLoginPayload,
  loginUserSchema,
} from "@/database/schemas/users";
import { UserRepository } from "@/modules/users/users-repository";
import { errorHandler } from "@/utils/errorHandler";

export class AuthService {
  constructor(private repo: UserRepository) {}

  async loginUser(data: UserLoginPayload) {
    try {
      const cleanedData = await loginUserSchema.parseAsync(data);
      const user = await this.repo.findOne({
        user: {
          workEmail: cleanedData.email,
        },
      });
      return user;
    } catch (error) {
      throw errorHandler(error, "Invalid credentials");
    }
  }

  async register(data: UserCreatePayload) {
    throw new Error("Method not implemented.");
  }

  async verifyUser(profileId: string) {
    try {
      const user = await this.repo.findById(profileId);
      return user;
    } catch (error) {
      errorHandler(error, "Unauthorized");
    }
  }

  async refreshToken(token: string | undefined) {
    throw new Error("Method not implemented.");
  }
}
