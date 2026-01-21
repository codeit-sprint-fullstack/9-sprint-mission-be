import { prismaClient } from "../../infra/prismaClient";
import { Requester } from "../../infra/AuthTokenManager";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";

import { Product } from "../../domain/Product";

export class DeleteProductLikeHandler {
  static async handle(
    requester: Requester,
    { productId }: { productId: number }
  ) {
    const productEntity = await prismaClient.$transaction(async (tx) => {
      const targetProductEntity = await tx.product.findUnique({
        where: {
          id: Number(productId),
        },
      });

      if (!targetProductEntity) {
        throw new NotFoundException(ExceptionMessage.PRODUCT_NOT_FOUND);
      }

      const likeEntity = await tx.like.findUnique({
        where: {
          userId_productId: {
            userId: requester.userId,
            productId: Number(productId),
          },
        },
      });

      if (likeEntity) {
        await tx.like.delete({
          where: {
            userId_productId: {
              userId: requester.userId,
              productId: Number(productId),
            },
          },
        });
      }

      return targetProductEntity;
    });

    const product = new Product(productEntity);

    return {
      id: product.id,
      ownerId: product.ownerId,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      images: product.images,
      createdAt: product.createdAt,
      isFavorite: false,
    };
  }
}
