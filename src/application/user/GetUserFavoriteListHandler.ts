import { prismaClient } from "../../infra/prismaClient";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { Product } from "../../domain/Product";
import { Requester } from "../../infra/AuthTokenManager";

export class GetUserFavoriteListHandler {
  static async handle(
    requester: Requester,
    {
      page,
      pageSize,
      keyword,
    }: { page: number; pageSize: number; keyword?: string }
  ) {
    const userEntity = await prismaClient.user.findUnique({
      where: {
        id: requester.userId,
      },
    });

    if (!userEntity) {
      throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
    }

    const favoriteProductCount = await prismaClient.product.count({
      where: {
        likes: {
          some: {
            userId: requester.userId,
          },
        },
        name: {
          contains: keyword,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const favoriteProductsEntities = await prismaClient.product.findMany({
      where: {
        likes: {
          some: {
            userId: requester.userId,
          },
        },
        name: {
          contains: keyword,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const favoriteProducts = favoriteProductsEntities.map(
      (favoriteProductEntity) => new Product(favoriteProductEntity)
    );

    return {
      totalCount: favoriteProductCount,
      list: favoriteProducts.map((product) => ({
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
      })),
    };
  }
}
