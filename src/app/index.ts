import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger as honoLogger } from "hono/logger";

import { showRoutes } from "hono/dev";
import { secureHeaders } from "hono/secure-headers";
import pinoLogger from "pino";
import { ServiceException } from "@/exceptions";
import { authMiddleware } from "@/middleware/auth-middleware";
import { authRouter } from "@/modules/auth/auth-routes";
import { userRouter } from "@/modules/users/users-routes";

const logger = pinoLogger({
  msgPrefix: "[App]: ",
  redact: {
    paths: ["hostname", "pid", "level"],
    remove: true,
  },
});

const app = new Hono().basePath("/api/v1/");

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(
  "*",
  secureHeaders({
    crossOriginResourcePolicy: false,
  })
);
app.use("*", honoLogger());

app.route("auth", authRouter);
app.use("*", authMiddleware);
app.route("users", userRouter);

app.onError((error, ctx) => {
  logger.error(error);

  if (error instanceof HTTPException) {
    if (error.status !== 500) {
      return ctx.json(
        { message: error.message, status: error.status },
        error.status
      );
    }
  } else if (error instanceof ServiceException) {
    return ctx.json({ message: error.message, status: 400 }, 400);
  }
  return ctx.json({ message: error.message, status: 500 }, 500);
});

if (process.env.NODE_ENV === "development") {
  showRoutes(app);
}

export default app;
