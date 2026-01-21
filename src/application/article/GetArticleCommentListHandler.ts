import { prismaClient } from "../../infra/prismaClient";

import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";

import { Comment } from "../../domain/Comment";
import { User } from "../../domain/User";

export class GetArticleCommentListHandler {
  static async handle({
    articleId,
    cursor,
    limit,
  }: {
    articleId: number;
    cursor: number;
    limit: number;
  }) {
    const commentEntities = await prismaClient.$transaction(async (tx) => {
      const targetArticleEntity = await tx.article.findUnique({
        where: {
          id: articleId,
        },
      });

      if (!targetArticleEntity) {
        throw new NotFoundException(ExceptionMessage.ARTICLE_NOT_FOUND);
      }

      return await tx.comment.findMany({
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        take: limit + 1,
        where: {
          articleId: articleId,
        },
      });
    });

    const comments = commentEntities.map(
      (commentEntity) => new Comment(commentEntity)
    );

    const writerEntities = await prismaClient.user.findMany({
      where: {
        id: {
          in: Array.from(new Set(comments.map((comment) => comment.writerId))),
        },
      },
    });

    const writers = writerEntities.map(
      (writerEntity) => new User(writerEntity)
    );

    const hasNext = comments.length === limit + 1;

    return {
      data: comments.slice(0, limit).map((comment) => {
        const writer = writers.find((writer) => writer.id === comment.writerId);

        if (!writer) {
          throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
        }

        return {
          id: comment.id,
          writer: {
            id: writer.id,
            nickname: writer.nickname,
            image: writer.image,
          },
          articleId: comment.articleId,
          content: comment.content,
          createdAt: comment.createdAt,
        };
      }),
      hasNext,
      nextCursor: hasNext ? comments[comments.length - 1].id : null,
    };
  }
}
