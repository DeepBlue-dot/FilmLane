import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg"; 

let prisma: PrismaClient;

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  try {
    const adapter = new PrismaPg({ 
      connectionString: databaseUrl 
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
