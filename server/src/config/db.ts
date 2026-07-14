import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

let prisma: PrismaClient;

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    const adapter = new PrismaMariaDb({
      host: url.hostname || "localhost",
      port: url.port ? parseInt(url.port, 10) : 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ""),
      connectionLimit: 5,
    });
    prisma = new PrismaClient({ adapter });
  } catch (error) {
    console.error("Failed to parse DATABASE_URL, falling back:", error);
    prisma = new PrismaClient({} as any);
  }
} else {
  // Safe fallback for testing contexts where DATABASE_URL is not set
  prisma = new PrismaClient({} as any);
}

export default prisma;
