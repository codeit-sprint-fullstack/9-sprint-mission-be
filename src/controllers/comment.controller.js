import { BadRequestException } from "../common/exceptions/badRequestException.js";
import { HttpStatus } from "../common/constants/index.js";
import { commentService } from "../services/comment.service.js";
import { NotFoundException } from "../common/exceptions/notFoundException.js";

export class CommentController {
  constructor(commentService) {
    this.commentService = commentService;
  }

  getComments = async (req, res, next) => {
    const { itemId } = req.params;

    if (!itemId) {
      throw new NotFoundException("상품 아이디를 찾지못했습니다.");
    }
    try {
      const itemData = await this.commentService.getComments(itemId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "아이템을 찾았습니다.",
        data: itemData,
      });
    } catch (error) {
      next(error);
    }
  };

  createCommentByItem = async (req, res, next) => {
    const { userId } = req.auth;
    const { itemId } = req.params;
    const { context } = req.body;

    if (!itemId || !context) {
      throw new BadRequestException("itemId 또는 context가 누락되었습니다.");
    }

    try {
      const newComment = await this.commentService.createComment({
        userId,
        itemId,
        context,
      });
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "댓글 생성에 성공했습니다",
        data: newComment,
      });
    } catch (error) {
      next(error);
    }
  };

  updateCommentByItemId = async (req, res, next) => {
    const { itemId, commentId } = req.params;
    const { context } = req.body;

    if (!itemId || !commentId) {
      throw NotFoundException("상품과 댓글아이디가 없습니다");
    }
    if (!context) {
      throw NotFoundException("댓글 본문을 입력해주세요");
    }

    try {
      const updatedComment = await this.commentService.updateComment({
        itemId,
        commentId,
        context,
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "댓글 업데이트에 성공했습니다.",
        data: updatedComment,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCommentByItemId = async (req, res, next) => {
    const { itemId, commentId } = req.params;

    if (!itemId || !commentId) {
      throw NotFoundException("상품과 댓글아이디가 없습니다");
    }

    try {
      const deletedComment = await this.commentService.deleteComment({
        itemId,
        commentId,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "댓글을 삭제하였습니다.",
        data: deletedComment,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const commentController = new CommentController(commentService);
