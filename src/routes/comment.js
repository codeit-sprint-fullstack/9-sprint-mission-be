import express from 'express';
import { commentRepository as Comment } from '../repository/comment.repository.js';
import { validateComments } from '../validators/validateComments.js';
import { NotFoundException } from '../err/notFoundException.js';

export const commentsRouter = express.Router();

commentsRouter.patch('/:id', validateComments, async (req, res, next) => {
  try {
    const { id } = req.params;
    const commentExistence = await Comment.findCommentById(id);
    if (!commentExistence) {
      throw new NotFoundException('댓글을 찾을 수 없습니다');
    }
    const updatedComment = await Comment.updateComment(id, req.body);
    res.json({
      success: true,
      data: updatedComment,
      message: '등록된 글 내용이 수정되었습니다',
    });
  } catch (err) {
    next(err);
  }
});

commentsRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const commentExistence = await Comment.findCommentById(id);
    if (!commentExistence) {
      throw new NotFoundException('댓글을 찾을 수 없습니다');
    }
    const deletedComment = await Comment.deleteComment(id);
    res.json({
      success: true,
      data: deletedComment,
      message: '글이 삭제되었습니다',
    });
  } catch (err) {
    next(err);
  }
});
