import { prismaClient } from "../../infra/prismaClient";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ForbiddenException } from "../../exceptions/ForbiddenException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { Article } from "../../domain/Article";
import { User } from "../../domain/User";
import { Requester } from "../../infra/AuthTokenManager";

export class UpdateArticleHandler {
  static async handle(
    requester: Requester,
    {
      articleId,
      title,
      content,
      image,
    }: {
      articleId: number;
      title?: string;
      content?: string;
      image?: string | null;
    }
  ) {
    const articleEntity = await prismaClient.$transaction(async (tx) => {
      const targetArticleEntity = await tx.article.findUnique({
        where: {
          id: articleId,
        },
      });

      if (!targetArticleEntity) {
        throw new NotFoundException(ExceptionMessage.ARTICLE_NOT_FOUND);
      }

      if (targetArticleEntity.writerId !== requester.userId) {
        throw new ForbiddenException(ExceptionMessage.FORBIDDEN);
      }

      return await tx.article.update({
        where: {
          id: articleId,
        },
        data: {
          title,
          content,
          image,
        },
      });
    });

    const article = new Article(articleEntity);

    const writerEntity = await prismaClient.user.findUnique({
      where: {
        id: article.writerId,
      },
    });

    if (!writerEntity) {
      throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
    }

    const writer = new User(writerEntity);

    return {
      id: article.id,
      writer: {
        id: writer.id,
        nickname: writer.nickname,
      },
      title: article.title,
      content: article.content,
      image: article.image,
      createdAt: article.createdAt,
    };
  }
}
