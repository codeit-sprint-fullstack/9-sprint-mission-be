import { prismaClient } from "../../infra/prismaClient";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ForbiddenException } from "../../exceptions/ForbiddenException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { Requester } from "../../infra/AuthTokenManager";

export class DeleteProductHandler {
  static async handle(
    requester: Requester,
    { productId }: { productId: number }
  ) {
    await prismaClient.$transaction(async (tx) => {
      const targetProductEntity = await tx.product.findUnique({
        where: {
          id: Number(productId),
        },
      });

      if (!targetProductEntity) {
        throw new NotFoundException(ExceptionMessage.PRODUCT_NOT_FOUND);
      }

      if (targetProductEntity.ownerId !== requester.userId) {
        throw new ForbiddenException(ExceptionMessage.FORBIDDEN);
      }

      return await tx.product.delete({
        where: {
          id: Number(productId),
        },
      });
    });
  }
}
