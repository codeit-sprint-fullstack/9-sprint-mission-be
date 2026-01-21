import { prismaClient } from "../../infra/prismaClient";
import { AuthTokenManager } from "../../infra/AuthTokenManager";
import { UserPasswordBuilder } from "../../infra/UserPasswordBuilder";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { User } from "../../domain/User";

export class SignInLocalUserHandler {
  static async handle({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const userEntity = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });
    if (!userEntity) {
      throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
    }

    const user = new User(userEntity);

    // 패스워드 일치 여부 확인
    if (!user.checkPassword(UserPasswordBuilder.hashPassword(password))) {
      // 보안을 위해 비밀번호가 일치하지 않는 경우에도 USER_NOT_FOUND 에러메시지를 반환합니다.
      throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
    }

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
