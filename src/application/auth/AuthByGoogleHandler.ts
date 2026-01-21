import { prismaClient } from "../../infra/prismaClient";
import { AuthTokenManager } from "../../infra/AuthTokenManager";
import { googleOAuthHelper } from "../../infra/GoogleOAuthAdapter";
import { InternalServerErrorException } from "../../exceptions/InternalServerErrorException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";

import { User } from "../../domain/User";

export class AuthByGoogleHandler {
  static async handle({ code }: { code: string }) {
    const googleAccessToken = await googleOAuthHelper.getAccessToken(code);
    const googleProfile = await googleOAuthHelper.getProfile(googleAccessToken);

    const userEntity = await prismaClient.user.findUnique({
      where: {
        email: googleProfile.email,
      },
    });

    if (userEntity) {
      const user = new User(userEntity);

      const accessToken = AuthTokenManager.buildAccessToken({
        userId: user.id,
      });
      const refreshToken = AuthTokenManager.buildRefreshToken({
        userId: user.id,
      });
      await prismaClient.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
        },
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          image: user.image,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    }

    if (!userEntity) {
      const createdUserEntity = await prismaClient.user.create({
        data: {
          email: googleProfile.email,
          nickname: googleProfile.nickname,
          password: "",
          image: googleProfile.image,
        },
      });

      const user = new User(createdUserEntity);

      const accessToken = AuthTokenManager.buildAccessToken({
        userId: user.id,
      });
      const refreshToken = AuthTokenManager.buildRefreshToken({
        userId: user.id,
      });
      await prismaClient.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
        },
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          image: user.image,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    }

    throw new InternalServerErrorException(
      ExceptionMessage.GOOGLE_LOGIN_FAILED
    );
  }
}
