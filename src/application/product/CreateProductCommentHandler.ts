import { prismaClient } from "../../infra/prismaClient";
import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";
import { Comment } from "../../domain/Comment";
import { User } from "../../domain/User";
import { Requester } from "../../infra/AuthTokenManager";

export class CreateProductCommentHandler {
  static async handle(
    requester: Requester,
    { productId, content }: { productId: number; content: string }
  ) {
    const commentEntity = await prismaClient.$transaction(async (tx) => {
      const targetProductEntity = await tx.product.findUnique({
        where: {
          id: Number(productId),
        },
      });

      if (!targetProductEntity) {
        throw new NotFoundException(ExceptionMessage.PRODUCT_NOT_FOUND);
      }

      return await tx.comment.create({
        data: {
          productId: Number(productId),
          writerId: requester.userId,
          content,
        },
      });
    });

    const comment = new Comment(commentEntity);

    const writerEntity = await prismaClient.user.findUnique({
      where: {
        id: comment.writerId,
      },
    });

    if (!writerEntity) {
      throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
    }

    const writer = new User(writerEntity);

    return {
      id: comment.id,
      writer: {
        id: writer.id,
        nickname: writer.nickname,
        image: writer.image,
      },
      content: comment.content,
      createdAt: comment.createdAt,
    };
  }
}
