import "dotenv/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    env: {
      NODE_ENV: "test",
      JWT_SECRET: process.env.JWT_SECRET || "secret",
      JWT_ALGORITHM: process.env.JWT_ALGORITHM || "HS256",
      DATABASE_URL: process.env.TEST_DATABASE_URL as string,
    },
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
    },
    globals: true,
    reporters: ["html", "default"],
    clearMocks: true,
    setupFiles: ["./src/utils/_setup/setupFiles.ts"],
  },
});
