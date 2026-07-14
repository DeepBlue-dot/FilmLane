import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "mysql://filmlane:1q2w3e4r5t@localhost:3306/filmlane",
  },
});
