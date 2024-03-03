import { Hono } from "hono";
import { authMiddleware } from "@/middleware/auth-middleware";
import { UserRepository } from "@/modules/users/users-repository";
import { AuthHandler } from "./auth-handlers";
import { AuthService } from "./auth-service";

const authRouter = new Hono();

const userRepo = new UserRepository();
const userHandlers = new AuthHandler(new AuthService(userRepo));

authRouter.post("login", userHandlers.login);
authRouter.post("register", userHandlers.register);
authRouter.use("*", authMiddleware);
authRouter.get("verify", userHandlers.verify);

export { authRouter };
