import pinoLogger from "pino";

const logger = pinoLogger({
  msgPrefix: "[gracefulShutdown]: ",
  redact: {
    paths: ["hostname", "pid", "level"],
    remove: true,
  },
});

type ServerService = {
  name: string;
  stop: () => Promise<void>;
  timeout?: number;
};

interface GracefulShutdownOptions {
  development?: boolean;
  services?: ServerService[];
}

export const gracefulShutdown = (
  signals: NodeJS.Signals[],
  opt: GracefulShutdownOptions
) => {
  const { development = false, services = [] } = opt;

  signals.forEach((signal) => {
    process.on(signal, async () => {
      logger.info(`Received ${signal}. Starting graceful shutdown.`);

      const promises = services.map((service) => {
        logger.info(`🚨 Stopping ${service.name} service.`);
        return service.stop();
      });

      if (promises.length === 0) {
        logger.info("No services to stop. Exiting process.");
        process.exit(0);
      }

      const timeout = services.reduce((acc, service) => {
        if (service.timeout) {
          return acc + service.timeout;
        }

        return acc + 5;
      }, 0);

      logger.info(`Waiting ${timeout} seconds for services to stop.`);
      let timer: NodeJS.Timeout;
      timer = setTimeout(() => {
        logger.error("Forcing process exit after timeout.");
        process.exit(1);
      }, timeout * 1000);

      await Promise.all(promises);

      logger.info("All services stopped. Exiting process.");
      clearTimeout(timer);
      process.exit(0);
    });
  });

  if (development) {
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught exception", error);
      process.exit(1);
    });

    process.on("unhandledRejection", (error) => {
      logger.error("Unhandled rejection", error);
      process.exit(1);
    });
  }
};
