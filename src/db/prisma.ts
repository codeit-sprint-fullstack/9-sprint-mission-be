import { PrismaClient, type Prisma } from "../generated/client.js";
import { exit } from "node:process";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const getPrismaLogLevel = (): Prisma.LogLevel[] => {
  if (process.env.NODE_ENV === "production") {
    return ["warn", "error"];
  }
  return ["query", "info", "warn", "error"];
};

const connectionString = process.env.DATABASE_URL as string;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: getPrismaLogLevel(),
});

export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("프리스마가 성공적으로 연결되었습니다.");
  } catch (error) {
    console.error(" 프리스마 를 연결하지 못했습니다.", error);
    exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
  console.log("Prisma Disconnected");
};
