import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

let prisma: any;

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  try {
    if (databaseUrl.startsWith("prisma://") || databaseUrl.startsWith("prisma+")) {
      prisma = new (PrismaClient as any)({ accelerateUrl: databaseUrl }).$extends(withAccelerate());
    } else {
      const pool = new pg.Pool({ connectionString: databaseUrl });
      const adapter = new PrismaPg(pool);
      prisma = new (PrismaClient as any)({ adapter });
    }
  } catch (error) {
    console.error("Failed to initialize Prisma Client, falling back:", error);
    try {
      prisma = new (PrismaClient as any)({ accelerateUrl: databaseUrl });
    } catch (e) {
      prisma = {};
    }
  }
} else {
  prisma = {};
}

export default prisma;
