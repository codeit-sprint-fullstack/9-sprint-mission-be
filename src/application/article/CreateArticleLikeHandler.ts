import { prismaClient } from "../../infra/prismaClient";

import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";

import { Article } from "../../domain/Article";
import { User } from "../../domain/User";
import { Requester } from "../../infra/AuthTokenManager";

export class CreateArticleLikeHandler {
  static async handle(
    requester: Requester,
    { articleId }: { articleId: number }
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

      const likeEntity = await tx.like.findUnique({
        where: {
          userId_articleId: {
            userId: requester.userId,
            articleId,
          },
        },
      });

      if (!likeEntity) {
        await tx.like.create({
          data: {
            userId: requester.userId,
            articleId,
          },
        });
      }

      return targetArticleEntity;
    });
    const article = new Article(articleEntity);

    const writerEntity = await prismaClient.user.findUnique({
      where: {
        id: articleEntity.writerId,
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
      isFavorite: article.isFavorite(requester.userId),
    };
  }
}
