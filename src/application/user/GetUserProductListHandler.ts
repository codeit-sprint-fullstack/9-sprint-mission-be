import { prismaClient } from "../../infra/prismaClient";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { Product } from "../../domain/Product";
import { Requester } from "../../infra/AuthTokenManager";

export class GetUserProductListHandler {
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

    const productCount = await prismaClient.product.count({
      where: {
        ownerId: requester.userId,
        name: {
          contains: keyword,
        },
      },
    });

    const productEntities = await prismaClient.product.findMany({
      where: {
        ownerId: requester.userId,
        name: {
          contains: keyword,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const products = productEntities.map(
      (productEntity) => new Product(productEntity)
    );

    return {
      totalCount: productCount,
      list: products.map((product) => ({
        id: product.id,
        ownerId: product.ownerId,
        name: product.name,
        description: product.description,
        price: product.price,
        tags: product.tags,
        images: product.images,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        favoriteCount: product.favoriteCount,
        isFavorite: product.isFavorite(requester.userId),
      })),
    };
  }
}
