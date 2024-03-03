import { describe, expect, it, vi } from "vitest";
import { UserRepository } from "@/modules/users/users-repository";
import { UserService } from "@/modules/users/users-service";

vi.mock("~/modules/users/users-repository.ts", () => {
  const UserRepository = vi.fn();
  UserRepository.prototype.findById = vi.fn();

  return { UserRepository };
});

describe("UserService", () => {
  it("should find user by id", async () => {
    const userRepo = new UserRepository();
    // @ts-ignore
    userRepo.findById.mockResolvedValueOnce({
      id: "1",
      email: "test@gmail.com",
      permissions: [],
    });
    const userService = new UserService(userRepo);
    const user = await userService.findById("1");
    expect(userRepo.findById).toBeCalledTimes(1);
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("permissions");
  });
});
