import { prismaClient } from "../../infra/prismaClient";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { User } from "../../domain/User";
import { Requester } from "../../infra/AuthTokenManager";

export class GetUserProfileHandler {
  static async handle(requester: Requester) {
    const userEntity = await prismaClient.user.findUnique({
      where: {
        id: requester.userId,
      },
    });
    if (!userEntity) {
      throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
    }

    const user = new User(userEntity);

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
