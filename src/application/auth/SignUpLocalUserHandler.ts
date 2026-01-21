import { prismaClient } from "../../infra/prismaClient";
import { AuthTokenManager } from "../../infra/AuthTokenManager";
import { UserPasswordBuilder } from "../../infra/UserPasswordBuilder";
import { UnprocessableEntityException } from "../../exceptions/UnprocessableEntityException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";

import { User } from "../../domain/User";

export class SignUpLocalUserHandler {
  static async handle({
    email,
    nickname,
    password,
    passwordConfirmation,
  }: {
    email: string;
    nickname: string;
    password: string;
    passwordConfirmation: string;
  }) {
    // 패스워드 및 패스워드 확인 일치 여부 확인
    if (password !== passwordConfirmation) {
      throw new UnprocessableEntityException(
        ExceptionMessage.PASSWORD_CONFIRMATION_NOT_MATCH
      );
    }

    // 이미 존재하는 이메일인지 확인
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new UnprocessableEntityException(
        ExceptionMessage.ALREADY_REGISTERED_EMAIL
      );
    }

    const userEntity = await prismaClient.user.create({
      data: {
        email,
        nickname,
        password: UserPasswordBuilder.hashPassword(password),
      },
    });

    const user = new User(userEntity);

    // 액세스 토큰 및 리프레시 토큰 발급
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
}
