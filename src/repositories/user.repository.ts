import { prisma } from "../db/prisma";
import type { PrismaClient, Prisma } from "../generated/client";
import { User } from "../types/user";

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /** 유저 아이디로 공개된 사용자정보를 찾습니다. */
  async findUserById(userId: string):Promise<Pick<User, "id" | "email" | "nickname"> | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
      },
    });
  }
}

export const userRepository = new UserRepository(prisma);
