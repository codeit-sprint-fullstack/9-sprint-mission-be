import { prismaClient } from "../../infra/prismaClient";

import { NotFoundException } from "../../exceptions/NotFoundException";
import { ForbiddenException } from "../../exceptions/ForbiddenException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { Requester } from "../../infra/AuthTokenManager";

export class DeleteArticleHandler {
  static async handle(
    requester: Requester,
    { articleId }: { articleId: number }
  ) {
    await prismaClient.$transaction(async (tx) => {
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

      return await tx.article.delete({
        where: {
          id: articleId,
        },
      });
    });
  }
}
