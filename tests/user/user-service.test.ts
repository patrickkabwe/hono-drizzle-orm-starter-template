import { UserRepository } from "@/modules/users/users-repository";
import { UserService } from "@/modules/users/users-service";
import { randomUUID } from "crypto";

vi.mock("@/modules/users/users-repository.ts", () => {
  const UserRepository = vi.fn();
  UserRepository.prototype.findById = vi.fn();

  return { UserRepository };
});

describe("UserService", () => {
  it("should find user by id", async () => {
    const userRepo = new UserRepository();
    const id = randomUUID();
    // @ts-ignore
    userRepo.findById.mockResolvedValueOnce({
      id,
      email: "test@gmail.com",
    });
    const userService = new UserService(userRepo);
    const user = await userService.findById(id);
    expect(userRepo.findById).toBeCalledTimes(1);
    expect(user).toHaveProperty("id");
  });
});
