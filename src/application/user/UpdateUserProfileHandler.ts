import { prismaClient } from "../../infra/prismaClient";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { Requester } from "../../infra/AuthTokenManager";

export class UpdateUserProfileHandler {
  static async handle(requester: Requester, { image }: { image: string }) {
    const updatedUser = await prismaClient.user.update({
      where: {
        id: requester.userId,
      },
      data: {
        image,
      },
    });

    if (!updatedUser) {
      throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
    }

    return {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        nickname: updatedUser.nickname,
        image: updatedUser.image,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    };
  }
}
