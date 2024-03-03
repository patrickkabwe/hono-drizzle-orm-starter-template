import { describe, expect, it } from "vitest";
import { ServerException, ServiceException } from "@/exceptions";

describe("ServiceException", () => {
  it("should create a new instance of ServiceException", () => {
    const serviceException = new ServiceException("message");
    expect(serviceException.message).toBe("message");
    expect(serviceException.name).toBe("ServiceException");
  });

  it("should create a new instance of ServerException", () => {
    const serverException = new ServerException();
    expect(serverException.message).toBe("Unexpected error occurred");
    expect(serverException.name).toBe("ServerException");
  });
});
