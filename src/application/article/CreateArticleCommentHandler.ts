import { prismaClient } from "../../infra/prismaClient";

import { NotFoundException } from "../../exceptions/NotFoundException";
import { ExceptionMessage } from "../../constant/ExceptionMessage";

import { Comment } from "../../domain/Comment";
import { User } from "../../domain/User";
import { Requester } from "../../infra/AuthTokenManager";

export class CreateArticleCommentHandler {
  static async handle(
    requester: Requester,
    { articleId, content }: { articleId: number; content: string }
  ) {
    /**
     * [게시글 댓글 등록 트랜잭션]
     *
     * 1. 게시글이 존재하는지 확인합니다.
     * 2. 게시글이 존재한다면, 댓글을 등록합니다.
     */
    const commentEntity = await prismaClient.$transaction(async (tx) => {
      const targetArticleEntity = await tx.article.findUnique({
        where: {
          id: articleId,
        },
      });

      if (!targetArticleEntity) {
        throw new NotFoundException(ExceptionMessage.ARTICLE_NOT_FOUND);
      }

      return await tx.comment.create({
        data: {
          articleId,
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
