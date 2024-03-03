import { AuthService } from "@/modules/auth/auth-service";
import { UserRepository } from "@/modules/users/users-repository";
import { randomUUID } from "node:crypto";

vi.mock("src/modules/users/users-repository.ts", () => {
  const UserRepository = vi.fn();
  UserRepository.prototype.findById = vi.fn();
  UserRepository.prototype.findOne = vi.fn();

  return { UserRepository };
});

describe("AuthService", () => {
  it("should return user for valid email and password", async () => {
    const data = {
      email: "test@gmai.com",
      password: "test123",
    };
    const userRepo = new UserRepository();
    // @ts-ignore
    userRepo.findOne.mockResolvedValueOnce({
      id: randomUUID(),
      email: "test@gmai.com",
      password: "$2b$10$5Uob16O9vPKhh6Gqx.yseu9MFNsxx.6U56YWtcFfv1zWcAhEqdzsm",
    });
    const authService = new AuthService(userRepo);

    const user = await authService.loginUser(data);

    expect(userRepo.findOne).toBeCalledTimes(1);
    expect(user).toHaveProperty("id");
    expect(user).not.toHaveProperty("password");
  });

  it("should not return user for invalid email and password", async () => {
    const data = {
      email: "test@.com",
      password: "test123",
    };
    const userRepo = new UserRepository();
    // @ts-ignore
    userRepo.findById.mockResolvedValueOnce({
      id: "1",
      email: "test@gmai.com",
    });
    const authService = new AuthService(userRepo);

    expect(userRepo.findById).not.toHaveBeenCalled();
    expect(authService.loginUser(data)).rejects.toThrow("Invalid email");
  });
});
