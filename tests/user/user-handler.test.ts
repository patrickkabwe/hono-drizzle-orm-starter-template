import app from "@/app";
import { AuthService } from "@/modules/auth/auth-service";
import { UserRepository } from "@/modules/users/users-repository";
import { randomUUID } from "crypto";

vi.mock("@/modules/auth/auth-service", () => {
  const AuthService = vi.fn();
  AuthService.prototype.loginUser = vi.fn();

  return { AuthService };
});

vi.mock("@/modules/users/users-repository.ts", () => {
  const UserRepository = vi.fn();
  UserRepository.prototype.findById = vi.fn();

  return { UserRepository };
});

let authService: AuthService;

beforeEach(() => {
  const user = {
    email: "test@gmail.com",
  };
  const userRepo = {
    findOne: vi.fn((id: string) =>
      Promise.resolve({
        id,
        ...user,
      })
    ),
  };
  authService = new AuthService(userRepo as any);
});

describe("UserHandler", () => {
  it("GET /me", async () => {
    const userId = randomUUID();
    const userRepo = new UserRepository();
    // @ts-ignore
    authService.loginUser.mockResolvedValueOnce({
      id: userId,
      email: "test@gmail.com",
      password: "$2b$10$5Uob16O9vPKhh6Gqx.yseu9MFNsxx.6U56YWtcFfv1zWcAhEqdzsm",
    });

    // @ts-ignore
    userRepo.findById.mockResolvedValueOnce({
      id: userId,
      email: "test@gmail.com",
      password: "$2b$10$5Uob16O9vPKhh6Gqx.yseu9MFNsxx.6U56YWtcFfv1zWcAhEqdzsm",
    });

    const reqHeaders = new Headers();
    reqHeaders.append("Content-Type", "application/json");
    // include cors headers from client
    reqHeaders.append("Origin", "http://localhost:3000");
    reqHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000");
    reqHeaders.append("Access-Control-Allow-Credentials", "true");

    const req = new Request("http://localhost:5100/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@gmail.com",
        password: "test",
      }),
      headers: reqHeaders,
    });
    const loginRes = await app.request(req);

    const headers = await loginRes.headers;

    const combinedHeaders = headers;
    combinedHeaders.set("cookie", headers.get("set-cookie") as string);

    const res = await app.request("http://localhost:5100/api/v1/users/me", {
      headers: combinedHeaders,
    });

    const jsonRes = await res.json();

    expect(res.status).toBe(200);
    // expect(jsonRes).toHaveProperty("id");
    // expect(jsonRes).toHaveProperty("permissions");
    // expect(Array.isArray(jsonRes.permissions)).toBeTruthy();
    // expect(jsonRes).not.toHaveProperty("password");
  });
});
