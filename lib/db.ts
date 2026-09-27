import path from "node:path";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Prisma CLI resolves a relative SQLite path against the schema directory
 * (prisma/), while the generated client resolves it against process.cwd().
 * Normalize to an absolute path so migrate, seed and the running server all
 * hit the same file. Repo convention: DATABASE_URL="file:./dev.db".
 */
function resolveSqliteUrl(raw: string): string {
  if (!raw.startsWith("file:")) return raw;

  let target = raw.slice("file:".length).replace(/\\/g, "/");
  while (target.startsWith("/")) target = target.slice(1);

  if (path.isAbsolute(target) || /^[a-zA-Z]:\//.test(target)) {
    return `file:${target}`;
  }

  if (target.startsWith("./")) target = target.slice(2);
  if (target.startsWith("prisma/")) target = target.slice("prisma/".length);

  const resolved = path.join(process.cwd(), "prisma", target);
  return `file:${resolved.replace(/\\/g, "/")}`;
}

const rawUrl = process.env.DATABASE_URL;
const datasourceUrl = rawUrl ? resolveSqliteUrl(rawUrl) : undefined;

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(datasourceUrl ? { datasourceUrl } : {}),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
