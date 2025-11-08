import express from 'express';
import { articleRepository as Article } from '../repository/article.repository.js';
import { validateArticles } from '../validators/validateArticles.js';
import { NotFoundException } from '../err/notFoundException.js';
import { commentRepository as Comment } from '../repository/comment.repository.js';
import { validateComments } from '../validators/validateComments.js';

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
    res.json({ success: true, data: article });
  } catch (err) {
    next(err);
  }
});

articlesRouter.post('/', validateArticles, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const newArticle = await Article.createArticle({
      title,
      content,
    });
    res.status(201).json({
      success: true,
      data: newArticle,
      message: '글이 정상적으로 추가되었습니다',
    });
  } catch (err) {
    next(err);
  }
});

articlesRouter.patch('/:id', validateArticles, async (req, res, next) => {
  try {
    const { id } = req.params;
    const articleExistence = await Article.findArticleById(id);
    if (!articleExistence) {
      throw new NotFoundException('글을 찾을 수가 없습니다.');
    }
    const updatedArticle = await Article.updateArticle(id, req.body);
    res.json({
      success: true,
      data: updatedArticle,
      message: '등록된 글 내용이 수정되었습니다',
    });
  } catch (err) {
    next(err);
  }
});

articlesRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const articleExistence = await Article.findArticleById(id);
    if (!articleExistence) {
      throw new NotFoundException('글을 찾을 수가 없습니다.');
    }
    const deletedArticle = await Article.deleteArticle(id);
    res.json({
      success: true,
      data: deletedArticle,
      message: '글이 삭제되었습니다',
    });
  } catch (err) {
    next(err);
  }
});

articlesRouter.get('/comments', async (req, res, next) => {
  try {
    const [totalCount, comments] = await Comment.findCommentsInArticle();

    res.json({
      success: true,
      list: comments,
      totalCount,
    });
  } catch (err) {
    next(err);
  }
});

articlesRouter.get('/:articleId/comments', async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const [totalCount, comments] =
      await Comment.findCommentsByArticleId(articleId);

    res.json({ success: true, list: comments, totalCount });
  } catch (err) {
    next(err);
  }
});

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
        data: newArticleComment,
        message: '댓글이 정상적으로 추가되었습니다',
      });
    } catch (err) {
      next(err);
    }
  },
);
