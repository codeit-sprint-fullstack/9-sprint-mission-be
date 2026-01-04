import { prisma } from "../db/prisma";
import type { PrismaClient } from "../generated/client";
import { UserSelectProfile } from "../types/user";

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /** 유저 아이디로 공개된 사용자정보를 찾습니다. */
  async findUserById(userId: string):Promise<UserSelectProfile | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        // 추가적인 필드가 없으므로 리턴타입은 Pick이 적합
      },
    });
  }
}

export const userRepository = new UserRepository(prisma);
