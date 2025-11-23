import { prisma } from "../db/prisma.js";

export class UserRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async findUserById(userId) {
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
