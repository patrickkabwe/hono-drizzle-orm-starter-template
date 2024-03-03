import { describe, expect, it, vi } from "vitest";
import { AuthService } from "@/modules/auth/auth-service";
import { UserRepository } from "@/modules/users/users-repository";

vi.mock("src/modules/users/users-repository.ts", () => {
  const UserRepository = vi.fn();
  UserRepository.prototype.findById = vi.fn();

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
    userRepo.findById.mockResolvedValueOnce({
      id: "1",
      email: "test@gmai.com",
      permissions: [],
    });
    const authService = new AuthService(userRepo);

    const user = await authService.loginUser(data);

    expect(userRepo.findById).toBeCalledTimes(1);
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("permissions");
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
      permissions: [],
    });
    const authService = new AuthService(userRepo);

    expect(userRepo.findById).not.toHaveBeenCalled();
    expect(authService.loginUser(data)).rejects.toThrow("Invalid email");
  });
});
