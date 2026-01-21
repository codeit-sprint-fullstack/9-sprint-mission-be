import { prismaClient } from "../../infra/prismaClient";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { Article } from "../../domain/Article";
import { User } from "../../domain/User";
import { Requester } from "../../infra/AuthTokenManager";

export class GetArticleHandler {
  static async handle(
    requester: Requester,
    { articleId }: { articleId: number }
  ) {
    const articleEntity = await prismaClient.article.findUnique({
      where: {
        id: articleId,
      },
      include: {
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!articleEntity) {
      throw new NotFoundException(ExceptionMessage.ARTICLE_NOT_FOUND);
    }

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
        image: writer.image,
      },
      title: article.title,
      content: article.content,
      image: article.image,
      createdAt: article.createdAt,
      favoriteCount: article.favoriteCount,
      isFavorite: article.isFavorite(requester.userId),
    };
  }
}
