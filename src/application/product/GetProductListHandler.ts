import { prismaClient } from "../../infra/prismaClient";
import { Product } from "../../domain/Product";
import { Requester } from "../../infra/AuthTokenManager";

export class GetProductListHandler {
  static async handle(
    requester: Requester,
    {
      page,
      pageSize,
      orderBy,
      keyword,
    }: {
      page: number;
      pageSize: number;
      orderBy: string;
      keyword?: string;
    }
  ) {
    const whereClause = keyword
      ? {
          OR: [
            {
              name: {
                contains: keyword,
              },
            },
            {
              description: {
                contains: keyword,
              },
            },
          ],
        }
      : undefined;

    const matchedProductCount = await prismaClient.product.count({
      where: whereClause,
    });

    const orderByOption = (() => {
      switch (orderBy) {
        case "favorite":
          return {
            likes: {
              _count: "desc",
            },
          };
        case "recent":
        default:
          return { createdAt: "desc" };
      }
    })();

    const productEntities = await prismaClient.product.findMany({
      skip: pageSize * (page - 1),
      take: pageSize,
      where: whereClause,
      orderBy: orderByOption as any,
      include: {
        _count: {
          select: { likes: true },
        },
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    const products = productEntities.map(
      (productEntity) => new Product(productEntity)
    );

    return {
      totalCount: matchedProductCount,
      list: products.slice(0, pageSize).map((product) => ({
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
