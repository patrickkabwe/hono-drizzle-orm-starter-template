import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    env: {
      NODE_ENV: "test",
      JWT_SECRET: process.env.JWT_SECRET || "secret",
      JWT_ALGORITHM: process.env.JWT_ALGORITHM || "HS256",
      DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        "postgres://postgres:postgres@localhost:5432/erpgen-test?schema=public&connection_limit=1",
    },
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
    },
    reporters: ["html", "default"],
    clearMocks: true,
    setupFiles: ["./tests/_setup/setupFiles.ts"],
  },
});
