import express from 'express';
import { articlesRepository as Article } from '../repository/articles.repository.js';
import { validateArticles } from '../validators/validateArticles.js';
import { NotFoundException } from '../err/notFoundException.js';
import { commentsRepository as Comment } from '../repository/comments.repository.js';
import { validateComments } from '../validators/validateComments.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { parsePagination } from '../middlewares/pagination.middleware.js';

export const articlesRouter = express.Router();

articlesRouter.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize =
      parseInt(req.query.pageSize, 10) || Number.MAX_SAFE_INTEGER;
    const keyword = req.query.keyword;
    const orderBy = req.query.orderBy;
    const offset = (page - 1) * pageSize;

    const where = {};
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { content: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    const orderByOptions = [];
    if (orderBy === 'recent') {
      orderByOptions.push({ createdAt: 'desc' });
    }

    const [totalCount, articles] = await Article.findArticlesMany({
      where,
      orderBy: orderByOptions,
      skip: offset,
      take: pageSize,
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      list: articles,
      page,
      pageSize,
      totalCount,
    });
  } catch (err) {
    next(err);
  }
});

articlesRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await Article.findArticleById(id);
    if (!article) {
      throw new NotFoundException('글을 찾을 수 없습니다');
    }
    res.json({ success: true, ...article });
  } catch (err) {
    next(err);
  }
});

articlesRouter.post(
  '/',
  authMiddleware,
  validateArticles,
  async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const { id: authorId } = req.user;
      const newArticle = await Article.createArticle({
        title,
        content,
        authorId,
      });
      res.status(201).json({
        success: true,
        message: '글이 정상적으로 추가되었습니다',
        ...newArticle,
      });
    } catch (err) {
      next(err);
    }
  },
);

articlesRouter.patch(
  '/:id',
  authMiddleware,
  validateArticles,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const articleExistence = await Article.findArticleById(id);
      if (!articleExistence) {
        throw new NotFoundException('글을 찾을 수가 없습니다.');
      }
      const updatedArticle = await Article.updateArticle(id, req.body);
      res.json({
        success: true,
        message: '등록된 글 내용이 수정되었습니다',
        ...updatedArticle,
      });
    } catch (err) {
      next(err);
    }
  },
);

articlesRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const articleExistence = await Article.findArticleById(id);
    if (!articleExistence) {
      throw new NotFoundException('글을 찾을 수가 없습니다.');
    }
    const deletedArticle = await Article.deleteArticle(id);
    res.json({
      success: true,
      message: '글이 삭제되었습니다',
      id: deletedArticle.id,
    });
  } catch (err) {
    next(err);
  }
});

articlesRouter.get('/comments', parsePagination, async (req, res, next) => {
  try {
    const { comments, nextCursor } = await Comment.findCommentsInArticle(
      req.pagination,
    );

    res.json({
      success: true,
      list: comments,
      nextCursor,
    });
  } catch (err) {
    next(err);
  }
});

articlesRouter.get(
  '/:articleId/comments',
  parsePagination,
  async (req, res, next) => {
    try {
      const { articleId } = req.params;
      const { comments, nextCursor } = await Comment.findCommentsByArticleId({
        articleId,
        ...req.pagination,
      });

      res.json({ success: true, list: comments, nextCursor });
    } catch (err) {
      next(err);
    }
  },
);

articlesRouter.post(
  '/:articleId/comments',
  validateComments,
  async (req, res, next) => {
    try {
      const { articleId } = req.params;
      const articleExistence = await Article.findArticleById(articleId);
      if (!articleExistence) {
        throw new NotFoundException(
          '댓글을 단 글을 찾을 수가 없어요. 어디다 댓글을 쓴거야?',
        );
      }
      const { content } = req.body;
      const parent = 'Article';
      const newArticleComment = await Comment.createComment({
        content,
        parent,
        articleId,
      });
      res.json({
        success: true,
        message: '댓글이 정상적으로 추가되었습니다',
        ...newArticleComment,
      });
    } catch (err) {
      next(err);
    }
  },
);
