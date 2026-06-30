import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL || "";
  let poolOptions: pg.PoolConfig;

  if (connectionString.startsWith("postgresql://") || connectionString.startsWith("postgres://")) {
    try {
      const urlObj = new URL(connectionString);
      poolOptions = {
        host: urlObj.hostname,
        port: parseInt(urlObj.port || "5432"),
        database: urlObj.pathname.substring(1).split("?")[0],
        user: urlObj.username,
        password: decodeURIComponent(urlObj.password || ""),
      };

      const ssl = urlObj.searchParams.get("sslmode");
      if (ssl === "require" || ssl === "prefer") {
        poolOptions.ssl = { rejectUnauthorized: false };
      }
    } catch (e) {
      console.warn("Failed to parse DATABASE_URL as URL, falling back to connectionString direct binding.", e);
      poolOptions = { connectionString };
    }
  } else {
    poolOptions = { connectionString };
  }

  const pool = new pg.Pool(poolOptions);
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: ["query"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

