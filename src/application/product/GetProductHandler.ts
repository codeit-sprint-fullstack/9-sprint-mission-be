import { prismaClient } from "../../infra/prismaClient";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { Product } from "../../domain/Product";
import { Requester } from "../../infra/AuthTokenManager";

export class GetProductHandler {
  static async handle(
    requester: Requester,
    { productId }: { productId: number }
  ) {
    const productEntity = await prismaClient.product.findUnique({
      where: {
        id: Number(productId),
      },
      include: {
        likes: {
          select: {
            // 좋아요의 id, userId만 필요함
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!productEntity) {
      throw new NotFoundException(ExceptionMessage.PRODUCT_NOT_FOUND);
    }

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
      favoriteCount: product.favoriteCount,
      isFavorite: product.isFavorite(requester.userId),
    };
  }
}
