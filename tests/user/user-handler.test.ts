import { beforeEach, describe, it, vi } from "vitest";
import app from "@/app";
import { UserService } from "@/modules/users/users-service";

vi.mock("@/modules/users/users-service", () => {
  const UserService = vi.fn();
  UserService.prototype.findById = vi.fn();

  return { UserService };
});

let userService: UserService;

beforeEach(() => {
  const user = {
    email: "test@gmail.com",
  };
  const userRepo = {
    findById: vi.fn((id: string) =>
      Promise.resolve({
        id,
        ...user,
      })
    ),
  };
  userService = new UserService(userRepo as any);
});

describe("UserHandler", () => {
  it("GET /me", async () => {
    // @ts-ignore
    userService.findById.mockResolvedValueOnce({
      id: "1",
      email: "test@gmail.com",
      permissions: [],
    });

    // @ts-ignore
    userService.findById.mockResolvedValueOnce({
      id: "1",
      email: "test@gmail.com",
      permissions: [],
    });

    const loginRes = await app.request("api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@gmail.com",
        password: "test",
      }),
    });

    const headers = await loginRes.headers;

    const res = await app.request("/api/v1/users/me", {
      headers,
    });

    const jsonRes = await res.json();

    // expect(res.status).toBe(200);
    // expect(jsonRes).toHaveProperty("id");
    // expect(jsonRes).toHaveProperty("permissions");
    // expect(Array.isArray(jsonRes.permissions)).toBeTruthy();
    // expect(jsonRes).not.toHaveProperty("password");
  });
});
