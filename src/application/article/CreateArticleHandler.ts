import { prismaClient } from "../../infra/prismaClient";
import { Article } from "../../domain/Article";
import { User } from "../../domain/User";
import { Requester } from "../../infra/AuthTokenManager";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";

export class CreateArticleHandler {
  static async handle(
    requester: Requester,
    {
      title,
      content,
      image,
    }: { title: string; content: string; image: string | null }
  ) {
    const articleEntity = await prismaClient.article.create({
      data: {
        writerId: requester.userId,
        title,
        content,
        image,
      },
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
        image: writer.image,
      },
      title: article.title,
      content: article.content,
      image: article.image,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }
}
