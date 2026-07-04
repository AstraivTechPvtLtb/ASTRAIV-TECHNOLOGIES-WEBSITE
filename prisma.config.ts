import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL") || "postgresql://postgres:REDACTED_DEV_PWD@localhost:5432/astraiv_tech?schema=public",
  },
});
