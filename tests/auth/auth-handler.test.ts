import app from "@/app";
import { UserRepository } from "@/modules/users/users-repository";
import { randomUUID } from "crypto";

beforeEach(() => {
  vi.mock("@/modules/users/users-repository.ts", () => {
    const UserRepository = vi.fn();
    UserRepository.prototype.findById = vi.fn();
    UserRepository.prototype.findOne = vi.fn();

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
        password: "test123",
      };
      const userRepo = new UserRepository();
      // @ts-ignore
      userRepo.findOne.mockResolvedValue({
        id: randomUUID(),
        email: "test@gmail.com",
        password:
          "$2b$10$5Uob16O9vPKhh6Gqx.yseu9MFNsxx.6U56YWtcFfv1zWcAhEqdzsm",
      });

      const res = await app.request("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const cookieHeader = await res.headers.get("set-cookie");
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(cookieHeader).not.toBeNull();
      expect(body.data).toHaveProperty("id");
    });

    it("should not login user in to app", async () => {
      const data = {
        email: "test@.com",
        password: "test1233",
      };
      const userRepo = new UserRepository();

      // @ts-ignore
      userRepo.findOne.mockResolvedValue(null);

      const res = await app.request("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const cookieHeader = await res.headers.get("set-cookie");
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(cookieHeader).toBeNull();
      expect(body).toHaveProperty("error");
      expect(body.error.message).toBe("Invalid email");
    });

    it("should throw error if user doesn't exists", async () => {
      const data = {
        email: "test@g.com",
        password: "test1233",
      };
      const userRepo = new UserRepository();

      // @ts-ignore
      userRepo.findOne.mockResolvedValue({
        id: randomUUID(),
        email: "test@gmail.com",
        password:
          "$2b$10$PdHWAoOLEgXy5rLan4mbI.T0rY4abmw8V7mBM7SZGjFmTHiWXxtm1",
      });

      const res = await app.request("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const cookieHeader = await res.headers.get("set-cookie");
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(cookieHeader).toBeNull();
      expect(body.error).toHaveProperty("message");
      expect(body.error.message).toBe("Invalid credentials");
    });
  });
});
