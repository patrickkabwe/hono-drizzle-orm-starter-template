import {
  UserCreatePayload,
  UserLoginPayload,
  insertUserSchema,
  loginUserSchema,
} from "@/database/schemas/users";
import { ServiceException } from "@/exceptions";
import { UserRepository } from "@/modules/users/users-repository";
import { errorHandler } from "@/utils/errorHandler";
import { compare, hash } from "bcrypt-ts";

export class AuthService {
  constructor(private repo: UserRepository) {}

  async loginUser(data: UserLoginPayload) {
    try {
      const cleanedData = await loginUserSchema.parseAsync(data);

      const user = await this.repo.findOne({
        email: cleanedData.email,
      });

      if (!user) {
        throw new ServiceException("Invalid credentials");
      }

      const isPasswordValid = await this.comparePassword(
        cleanedData.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new ServiceException("Invalid credentials");
      }

      // @ts-ignore
      delete user.password;

      return user;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async register(data: UserCreatePayload) {
    try {
      const cleanedData = await insertUserSchema.parseAsync(data);
      const userExists = await this.repo.exists({
        email: cleanedData.email,
      });
      if (userExists) {
        throw new ServiceException("User already exists");
      }

      cleanedData.password = await this.hashPassword(cleanedData.password);

      const user = await this.repo.create(cleanedData);

      return user;
    } catch (error) {
      throw errorHandler(error);
    }
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

  async hashPassword(password: string) {
    return await hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await compare(password, hashedPassword);
  }
}
