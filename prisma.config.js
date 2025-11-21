import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema",
  migrations: {
    path: "./prisma/migrations",
    seed: "node --env-file=./env/.env.development scripts/seed.js",
  },
  datasource: {
    url: env("DIRECT_URL"),
    // directUrl: env("DIRECT_URL"),
  },
});
