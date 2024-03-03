import { createJWTToken, decodeJWTToken, verifyJWTToken } from "@/utils/token";
import { describe, expect, it } from "vitest";

describe("createJWTToken", () => {
  it("should return a string", async () => {
    const token = await createJWTToken({ uid: "1" });
    expect(typeof token).toBe("string");
  });
});

describe("verifyJWTToken", () => {
  it("should return a payload", async () => {
    const token = await createJWTToken({ uid: "1" });
    const payload = await verifyJWTToken(token);
    expect(payload.uid).toBe("1");
  });
});

describe("decodeJWTToken", () => {
  it("should return a payload", async () => {
    const token = await createJWTToken({ uid: "1" });
    const payload = decodeJWTToken(token);
    expect(payload.uid).toBe("1");
  });
});
