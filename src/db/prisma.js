// prisma client 설정
import { PrismaClient } from "@prisma/client";
import { exit } from "node:process";
import { PrismaPg } from "@prisma/adapter-pg";

const getPrismaLogLevel = () => {
  if (process.env.NODE_ENV === "production") {
    return ["warn", "error"];
  }
  return ["query", "info", "warn", "error"];
};
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({
  adapter,
  log: getPrismaLogLevel(),
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("프리스마가 성공적으로 연결되었습니다.");
  } catch (error) {
    console.error(" 프리스마 를 연결하지 못했습니다.", error);
    exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log("Prisma Disconnected");
};
