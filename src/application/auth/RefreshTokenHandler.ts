import { prismaClient } from "../../infra/prismaClient";
import { AuthTokenManager } from "../../infra/AuthTokenManager";
import { UnprocessableEntityException } from "../../exceptions/UnprocessableEntityException";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { User } from "../../domain/User";

export class RefreshTokenHandler {
  static async handle({ refreshToken }: { refreshToken: string }) {
    if (!AuthTokenManager.isValidRefreshToken(refreshToken)) {
      throw new UnprocessableEntityException(
        ExceptionMessage.INVALID_REFRESH_TOKEN
      );
    }

    const requester = AuthTokenManager.getRequesterFromToken(
      `bearer ${refreshToken}`
    );

    const userEntity = await prismaClient.user.findUnique({
      where: {
        id: requester.userId,
      },
    });
    if (!userEntity) {
      throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
    }

    const refreshTokenEntity = await prismaClient.refreshToken.findFirst({
      where: {
        userId: requester.userId,
        token: refreshToken,
      },
    });
    if (!refreshTokenEntity) {
      throw new UnprocessableEntityException(
        ExceptionMessage.INVALID_REFRESH_TOKEN
      );
    }

    const user = new User(userEntity);

    return {
      accessToken: AuthTokenManager.buildAccessToken({
        userId: user.id,
      }),
    };
  }
}
