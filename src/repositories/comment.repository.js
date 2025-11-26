import { prisma } from "../db/prisma.js";

export class CommentRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async findAllComment(itemId) {
    const findAll = this.prisma.itemComment.findMany({
      where: { itemId },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            createdAt: true,
            updatedAt: true,
            userProfile: true,
          },
        },
      },
    });
    return findAll;
  }

  async create({ userId, itemId, context }) {
    const newComment = await this.prisma.itemComment.create({
      data: {
        userId,
        itemId,
        context,
      },
    });
    return newComment;
  }

  async update({ itemId, commentId, context }) {
    const updatedComment = await this.prisma.itemComment.update({
      where: { itemId, id: commentId },
      data: {
        context,
      },
    });
    return updatedComment;
  }

  async delete({ itemId, commentId }) {
    const deletedComment = await this.prisma.itemComment.delete({
      where: { itemId, id: commentId },
    });
    return deletedComment;
  }
}

export const commentRepository = new CommentRepository(prisma);
