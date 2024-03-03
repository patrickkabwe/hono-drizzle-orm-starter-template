import { TOKEN_KEY } from "@/constants";
import { UserCreatePayload, UserLoginPayload } from "@/database/schemas/users";
import { ServerContext } from "@/types/generic.types";
import { responseCreator } from "@/utils/responseCreator";
import { createJWTToken } from "@/utils/token";
import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { AuthService } from "./auth-service";

export class AuthHandler {
  constructor(private authService: AuthService) {}

  register = async (c: Context) => {
    const data = await c.req.json<UserCreatePayload>();
    const user = await this.authService.register(data);
    return c.json(
      responseCreator({
        success: true,
        data: user,
      })
    );
  };

  login = async (c: Context) => {
    const data = await c.req.json<UserLoginPayload>();
    const user = await this.authService.loginUser(data);
    const token = await createJWTToken({ uid: user.id });

    setCookie(c, TOKEN_KEY, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return c.json(
      responseCreator({
        success: true,
        data: user,
      })
    );
  };

  logout = async (c: ServerContext) => {
    setCookie(c, TOKEN_KEY, "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 24 * 7,
    });
    return c.json(responseCreator({ success: true }));
  };

  refreshToken = async (c: ServerContext) => {
    const token = getCookie(c, TOKEN_KEY);

    const user = await this.authService.refreshToken(token);
    return c.json(
      responseCreator({
        success: true,
        data: user,
      })
    );
  };

  verify = async (c: ServerContext) => {
    const userProfile = c.get("user");
    const user = await this.authService.verifyUser(userProfile.id);
    return c.json(
      responseCreator({
        success: true,
        data: user,
      })
    );
  };
}
