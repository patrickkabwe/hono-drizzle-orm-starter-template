import { config } from "dotenv";
config();

import { ServiceException } from "@/exceptions";
import { authMiddleware } from "@/middleware/auth-middleware";
import { authRouter } from "@/modules/auth/auth-routes";
import { userRouter } from "@/modules/users/users-routes";
import { responseCreator } from "@/utils/responseCreator";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { HTTPException } from "hono/http-exception";
import { logger as honoLogger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

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
  console.log({ error });
  
  if (error instanceof HTTPException) {
    if (error.status !== 500) {
      return ctx.json(
        { message: error.message, status: error.status },
        error.status
      );
    }
  } else if (error instanceof ServiceException) {
    return ctx.json(
      responseCreator({
        success: false,
        error: {
          code: "SERVICE_ERROR",
          message: error.message,
        },
      }),
      400
    );
  }
  return ctx.json(
    responseCreator({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      },
    }),
    500
  );
});

if (process.env.NODE_ENV === "development") {
  showRoutes(app);
}

export default app;
