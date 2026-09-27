import * as dotenv from "dotenv";
import * as path from "path";
import { defineConfig } from "prisma/config";

// Explicitly load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
});
