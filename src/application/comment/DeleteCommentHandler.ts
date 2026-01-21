import { prismaClient } from "../../infra/prismaClient";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ForbiddenException } from "../../exceptions/ForbiddenException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { Requester } from "../../infra/AuthTokenManager";

export class DeleteCommentHandler {
  static async handle(
    requester: Requester,
    { commentId }: { commentId: number }
  ) {
    await prismaClient.$transaction(async (tx) => {
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

      return await tx.comment.delete({
        where: {
          id: Number(commentId),
        },
      });
    });
  }
}
