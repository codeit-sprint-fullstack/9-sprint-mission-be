import { prisma } from "../db/prisma";
import { PrismaClient, Prisma } from "../generated/client";
import { User } from "../types/user";

export class AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(userId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  /**
   * 소셜/로컬 공통
   * 예시 코드(특수한 경우)여서 Prisma.UserCreateInput을 사용해보았습니다.
   * data객체 통으로 전달해줍시다.
   */
  async save(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  async update(userId:string, data: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async createOrUpdate(provider:string, providerId:string, email:string, nickname:string):Promise<User> {
    return await this.prisma.user.upsert({
      where: { provider, providerId },
      update: { email, nickname },
      create: { provider, providerId, email, nickname },
    });
  }
}

export const authRepository = new AuthRepository(prisma);
