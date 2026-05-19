import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Build absolute path so Prisma can find the SQLite file regardless of cwd
const datasourceUrl =
  process.env.DATABASE_URL ??
  `file:${path.resolve(process.cwd(), "prisma", "dev.db")}`;

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
