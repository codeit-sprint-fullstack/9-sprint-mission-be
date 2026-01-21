import { prismaClient } from "../../infra/prismaClient";
import { UserPasswordBuilder } from "../../infra/UserPasswordBuilder";
import { UnprocessableEntityException } from "../../exceptions/UnprocessableEntityException";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { User } from "../../domain/User";
import { Requester } from "../../infra/AuthTokenManager";

export class UpdateUserPasswordHandler {
  static async handle(
    requester: Requester,
    {
      password,
      passwordConfirmation,
      currentPassword,
    }: {
      password: string;
      passwordConfirmation: string;
      currentPassword: string;
    }
  ) {
    // 패스워드와 패스워드 확인이 일치하는지 검증
    if (password !== passwordConfirmation) {
      throw new UnprocessableEntityException(
        ExceptionMessage.PASSWORD_CONFIRMATION_NOT_MATCH
      );
    }

    const userEntity = await prismaClient.user.findUnique({
      where: {
        id: requester.userId,
      },
    });
    if (!userEntity) {
      throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
    }

    const user = new User(userEntity);

    // 현재 패스워드가 일치하는지 검증
    if (
      !user.checkPassword(UserPasswordBuilder.hashPassword(currentPassword))
    ) {
      throw new UnprocessableEntityException(
        ExceptionMessage.CURRENT_PASSWORD_NOT_MATCH
      );
    }

    // 비밀번호 변경 진행
    const hashedPassword = UserPasswordBuilder.hashPassword(password);
    user.password = hashedPassword;
    await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return {
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
