import { prisma } from "../db/prisma.js";

export class AuthRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async findByEmail(email) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(userId) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async save({ email, nickname, encryptedPassword }) {
    return await this.prisma.user.create({
      data: {
        email: email,
        nickname: nickname,
        encryptedPassword,
      },
    });
  }

  async update(userId, data) {
    return await this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  // async createOrUpdate(provider, providerId, email, nickname) {
  //   return await this.prisma.user.upsert({
  //     where: { provider, providerId },
  //     update: { email, nickname },
  //     create: { provider, providerId, email, nickname },
  //   });
  // }
}

export const authRepository = new AuthRepository(prisma);
