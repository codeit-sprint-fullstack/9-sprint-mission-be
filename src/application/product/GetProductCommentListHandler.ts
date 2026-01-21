import { prismaClient } from "../../infra/prismaClient";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { Comment } from "../../domain/Comment";
import { User } from "../../domain/User";

export class GetProductCommentListHandler {
  static async handle({
    productId,
    cursor,
    limit,
  }: {
    productId: number;
    cursor: number | null;
    limit: number;
  }) {
    const commentEntities = await prismaClient.$transaction(async (tx) => {
      const targetProductEntity = await tx.product.findUnique({
        where: {
          id: Number(productId),
        },
      });

      if (!targetProductEntity) {
        throw new NotFoundException(ExceptionMessage.PRODUCT_NOT_FOUND);
      }

      return await tx.comment.findMany({
        cursor: cursor
          ? {
              id: Number(cursor),
            }
          : undefined,
        take: limit + 1,
        where: {
          productId: Number(productId),
        },
        orderBy: {
          id: "desc",
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
      list: comments.slice(0, limit).map((comment) => {
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
          productId: comment.productId,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        };
      }),
      nextCursor: hasNext ? comments[comments.length - 1].id : null,
    };
  }
}
