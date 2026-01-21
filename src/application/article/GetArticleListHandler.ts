import { prismaClient } from "../../infra/prismaClient";
import { Requester } from "../../infra/AuthTokenManager";
import { Article } from "../../domain/Article";
import { User } from "../../domain/User";
import { Like } from "../../domain/Like";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { NotFoundException } from "../../exceptions/NotFoundException";

export class GetArticleListHandler {
  static async handle(
    requester: Requester,
    {
      cursor,
      limit,
      orderBy,
      keyword,
    }: { cursor: number; limit: number; orderBy: string; keyword?: string }
  ) {
    const orderByOption = (() => {
      switch (orderBy) {
        case "favorite":
          return {
            likes: {
              _count: "desc", // 좋아요 많은 순으로 정렬
            },
          };
        case "recent":
        default:
          return { createdAt: "desc" };
      }
    })();

    const articleEntities = await prismaClient.article.findMany({
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      take: limit + 1,
      orderBy: orderByOption as any,
      where: {
        title: keyword ? { contains: keyword } : undefined,
      },
    });

    const articles = articleEntities.map(
      (articleEntity) => new Article(articleEntity)
    );

    const writerEntities = await prismaClient.user.findMany({
      where: {
        id: {
          in: Array.from(new Set(articles.map((article) => article.writerId))),
        },
      },
    });

    const writers = writerEntities.map(
      (writerEntity) => new User(writerEntity)
    );

    const likeEntities = await prismaClient.like.findMany({
      where: {
        userId: requester.userId,
        articleId: {
          in: Array.from(new Set(articles.map((article) => article.id))),
        },
      },
    });

    const likes = likeEntities.map((likeEntity) => new Like(likeEntity));

    const hasNext = articles.length === limit + 1;

    return {
      list: articles.slice(0, limit).map((article) => {
        const writer = writers.find((writer) => writer.id === article.writerId);
        const like = likes.find((like) => like.articleId === article.id);

        if (!writer) {
          throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
        }

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
          isFavorite: !!like,
        };
      }),
      nextCursor: hasNext ? articles[articles.length - 1].id : null,
    };
  }
}
