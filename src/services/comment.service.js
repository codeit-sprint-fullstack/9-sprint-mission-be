import { commentRepository } from "../repositories/comment.repository.js";

export class CommentService {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async getComments({ itemId }) {
    const itemData = await this.commentRepository.findAllComment(itemId);

    return itemData;
  }

  async createComment({ userId, itemId, context }) {
    const newComment = await this.commentRepository.create({
      userId,
      itemId,
      context,
    });

    if (!newComment) {
      throw new Error("댓글 생성에 실패했습니다");
    }

    return newComment;
  }

  async updateComment({ itemId, commentId, context }) {
    const updatedComment = await this.commentRepository.update({
      itemId,
      commentId,
      context,
    });
    return updatedComment;
  }

  async deleteComment({ itemId, commentId }) {
    const deletedComment = await this.commentRepository.delete({
      itemId,
      commentId,
    });
    return deletedComment;
  }
}

export const commentService = new CommentService(commentRepository);
