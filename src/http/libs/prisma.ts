import { PrismaClient } from "generated/prisma/client";
import { env } from "../env";

export const db = new PrismaClient({
  accelerateUrl: process.env.ACCELERATE_URL!,
  log: env.NODE_ENV === "dev" ? ["query"] : [],
});


