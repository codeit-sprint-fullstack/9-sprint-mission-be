import { prismaClient } from "../../infra/prismaClient";

import { Product } from "../../domain/Product";
import { Requester } from "../../infra/AuthTokenManager";

export class CreateProductHandler {
  static async handle(
    requester: Requester,
    {
      name,
      description,
      price,
      tags,
      images,
    }: {
      name: string;
      description: string;
      price: number;
      tags: string[];
      images: string[];
    }
  ) {
    const productEntity = await prismaClient.product.create({
      data: {
        ownerId: requester.userId,
        name,
        description,
        price,
        tags,
        images,
      },
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
