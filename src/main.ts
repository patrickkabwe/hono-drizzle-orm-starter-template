import app from "@/app";
import { gracefulShutdown } from "@/utils/gracefulShutdown";
import { serve } from "@hono/node-server";
import type { Server as HTTPSServer } from "node:http";
import pinoLogger from "pino";
import { Server as SocketIOServer } from "socket.io";
import { pgQueryClient } from "./database";

const logger = pinoLogger({
  msgPrefix: "[Main] ",
  redact: {
    paths: ["hostname", "pid", "level"],
    remove: true,
  },
});

const server = serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 5100,
  },
  (add) => {
    logger.info(`Listening on http://localhost:${add.port}`);
  }
);

const io = new SocketIOServer(server as HTTPSServer);

io.on("connection", (socket) => {
  socket.emit("hello", "world");
  socket.on("hello", (data) => {
    socket.broadcast.emit("hello", data);
  });
});

gracefulShutdown(["SIGTERM", "SIGINT"], {
  development: true,
  services: [
    {
      name: "database",
      stop: async () => {
        await pgQueryClient.end({
          timeout: 5,
        });
      },
      timeout: 5000,
    },
    {
      name: "server",
      timeout: 2000,
      stop: async () => {
        await server.close();
      },
    },
    {
      name: "websocket server",
      timeout: 2000,
      stop: async () => {
        await io.close();
      },
    },
  ],
});
