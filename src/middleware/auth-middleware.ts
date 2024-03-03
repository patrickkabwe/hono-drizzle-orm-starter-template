import { TOKEN_KEY } from "@/constants";
import { UserRepository } from "@/modules/users/users-repository";
import { ServerContext } from "@/types/generic.types";
import { verifyJWTToken } from "@/utils/token";
import { Next } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";

export const authMiddleware = async (c: ServerContext, next: Next) => {
  const { req } = c;
  const authHeader = req.header()?.authorization || getCookie(c, TOKEN_KEY);

  if (!authHeader) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const authToken = authHeader.replace("Bearer ", "");

  if (!authToken) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  try {
    const payload = await verifyJWTToken(authToken);

    if (!payload.uid) {
      throw new HTTPException(403, { message: "Forbidden" });
    }

    const userProfile = await new UserRepository().findById(payload.uid);

    c.set("user", userProfile);
  } catch (error: any) {
    if (error.name === "JWSInvalid") {
      throw new HTTPException(403, { message: "Forbidden" });
    }
  }

  await next();
};
