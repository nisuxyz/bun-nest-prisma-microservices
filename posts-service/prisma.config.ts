import "dotenv/config";
import type { PrismaConfig } from "prisma";

export default {

  migrations: {
    seed: "bun prisma/seed.ts"
  }
} satisfies PrismaConfig;