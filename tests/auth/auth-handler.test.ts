import app from "@/app";
import { ServerException } from "@/exceptions";
import { UserRepository } from "@/modules/users/users-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.mock("src/modules/users/users-repository.ts", () => {
    const UserRepository = vi.fn();
    UserRepository.prototype.findById = vi.fn();

    return { UserRepository };
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("AuthHandler", () => {
  describe("POST /login", () => {
    it("should login user", async () => {
      const data = {
        email: "test@gmail.com",
        password: "test1233",
      };
      const userRepo = new UserRepository();
      // @ts-ignore
      userRepo.findById.mockResolvedValue({
        id: "123",
        email: "test@gmail.com",
      });

      const res = await app.request("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const cookieHeader = await res.headers.get("set-cookie");

      expect(res.status).toBe(200);
      expect(cookieHeader).not.toBeNull();
      expect(await res.json()).toHaveProperty("id");
    });

    it("should not login user in to app", async () => {
      const data = {
        email: "test@.com",
        password: "test1233",
      };
      const userRepo = new UserRepository();

      // @ts-ignore
      userRepo.findById.mockResolvedValue(null);

      const res = await app.request("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const cookieHeader = await res.headers.get("set-cookie");
      const body = await res.json();
      expect(res.status).toBe(400);
      expect(cookieHeader).toBeNull();
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("status");
      expect(body.status).toBe(400);
      expect(body.message).toBe("Invalid email");
    });

    it("should throw error if user doesn't exists", async () => {
      const data = {
        email: "test@g.com",
        password: "test1233",
      };
      const userRepo = new UserRepository();

      const res = await app.request("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const cookieHeader = await res.headers.get("set-cookie");
      const body = await res.json();
      expect(res.status).toBe(400);
      expect(cookieHeader).toBeNull();
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("status");
      expect(body.message).toBe("Invalid credentials");
    });

    it("should not login user in to app", async () => {
      const data = {
        email: "test@g.com",
        password: "test1233",
      };
      const userRepo = new UserRepository();

      // @ts-ignore
      userRepo.findById.mockRejectedValueOnce(new ServerException());

      const res = await app.request("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const cookieHeader = await res.headers.get("set-cookie");
      const body = await res.json();
      expect(res.status).toBe(500);
      expect(cookieHeader).toBeNull();
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("status");
      expect(body.message).toBe("Unexpected error occurred");
    });
  });
});
