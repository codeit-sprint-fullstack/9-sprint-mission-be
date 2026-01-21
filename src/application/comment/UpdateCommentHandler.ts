import { prismaClient } from "../../infra/prismaClient";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ForbiddenException } from "../../exceptions/ForbiddenException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { Comment } from "../../domain/Comment";
import { User } from "../../domain/User";
import { Requester } from "../../infra/AuthTokenManager";

export class UpdateCommentHandler {
  static async handle(
    requester: Requester,
    { commentId, content }: { commentId: number; content: string }
  ) {
    const commentEntity = await prismaClient.$transaction(async (tx) => {
      const targetCommentEntity = await tx.comment.findUnique({
        where: {
          id: Number(commentId),
        },
      });

      if (!targetCommentEntity) {
        throw new NotFoundException(ExceptionMessage.COMMENT_NOT_FOUND);
      }

      if (targetCommentEntity.writerId !== requester.userId) {
        throw new ForbiddenException(ExceptionMessage.FORBIDDEN);
      }

      return await tx.comment.update({
        where: {
          id: Number(commentId),
        },
        data: {
          content,
        },
      });
    });

    const comment = new Comment(commentEntity);

    const writerEntity = await prismaClient.user.findUnique({
      where: {
        id: comment.writerId,
      },
    });

    if (!writerEntity) {
      throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
    }

    const writer = new User(writerEntity);

    return {
      id: comment.id,
      writer: {
        id: writer.id,
        nickname: writer.nickname,
        image: writer.image,
      },
      articleId: comment.articleId,
      productId: comment.productId,
      content: comment.content,
      createdAt: comment.createdAt,
    };
  }
}
