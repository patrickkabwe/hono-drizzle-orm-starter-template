import { Hono } from "hono";
import { UserHandler } from "./users-handler";
import { UserRepository } from "./users-repository";
import { UserService } from "./users-service";

type ServerVariables = {
  uid: string | null;
};

const userRouter = new Hono<{ Variables: ServerVariables }>();

const userRepo = new UserRepository();
const employeeService = new UserService(userRepo);
const userHandlers = new UserHandler(employeeService);

userRouter.get(":id", userHandlers.getMe);

export { userRouter };
