import express from 'express';
import { articleRepository as Article } from '../repository/article.repository.js';
import { validateArticles } from '../middlewares/validateArticles.js';
import { NotFoundException } from '../err/notFoundException.js';

export const articlesRouter = express.Router();

articlesRouter.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
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
    res.json({ success: true, list: article });
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
      list: newArticle,
      message: '글이 정상적으로 추가되었습니다',
    });
  } catch (err) {
    next(err);
  }
});

articlesRouter.patch('/:id', validateArticles, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedArticle = await Article.updateArticle(id, req.body);
    if (!updatedArticle) {
      throw new NotFoundException('글을 찾을 수 없습니다');
    }
    res.json({
      success: true,
      list: updatedArticle,
      message: '등록된 글 내용이 수정되었습니다',
    });
  } catch (err) {
    next(err);
  }
});

articlesRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedArticle = await Article.deleteArticle(id);
    if (!deletedArticle) {
      throw new NotFoundException('글을 찾을 수 없습니다');
    }
    res.json({
      success: true,
      list: deletedArticle,
      message: '글이 삭제되었습니다',
    });
  } catch (err) {
    next(err);
  }
});
