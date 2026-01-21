import { prismaClient } from "../../infra/prismaClient";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ForbiddenException } from "../../exceptions/ForbiddenException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { Product } from "../../domain/Product";
import { Requester } from "../../infra/AuthTokenManager";

export class UpdateProductHandler {
  static async handle(
    requester: Requester,
    {
      productId,
      name,
      description,
      price,
      tags,
      images,
    }: {
      productId: number;
      name?: string;
      description?: string;
      price?: number;
      tags?: string[];
      images?: string[];
    }
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

      if (targetProductEntity.ownerId !== requester.userId) {
        throw new ForbiddenException(ExceptionMessage.FORBIDDEN);
      }

      return await tx.product.update({
        where: {
          id: Number(productId),
        },
        data: {
          name,
          description,
          price,
          tags,
          images,
        },
      });
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
    };
  }
}
