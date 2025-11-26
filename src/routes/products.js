import express from 'express';
import { productsRepository as Product } from '../repository/products.repository.js';
import { validateProducts } from '../validators/validateProducts.js';
import { NotFoundException } from '../err/notFoundException.js';
import { commentsRepository as Comment } from '../repository/comments.repository.js';
import { validateComments } from '../validators/validateComments.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { parsePagination } from '../middlewares/pagination.middleware.js';

export const productsRouter = express.Router();

productsRouter.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const keyword = req.query.keyword;
    const orderBy = req.query.orderBy;
    const offset = (page - 1) * pageSize;

    const where = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    const orderByOptions = [];
    if (orderBy === 'recent') {
      orderByOptions.push({ createdAt: 'desc' });
    }

    const [totalCount, products] = await Product.findProductsMany({
      where,
      orderBy: orderByOptions,
      skip: offset,
      take: pageSize,
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      list: products,
      page,
      pageSize,
      totalCount,
    });
  } catch (err) {
    next(err);
  }
});

productsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findProductById(id);
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다');
    }
    res.json({ success: true, ...product });
  } catch (err) {
    next(err);
  }
});

productsRouter.post(
  '/',
  authMiddleware,
  validateProducts,
  async (req, res, next) => {
    try {
      const { name, description, price, tags, images } = req.body;
      const { id: authorId } = req.user;
      const newProduct = await Product.createProduct({
        name,
        description,
        price,
        tags,
        images,
        authorId,
      });
      res.status(201).json({
        success: true,
        message: '상품이 정상적으로 추가되었습니다',
        ...newProduct,
      });
    } catch (err) {
      next(err);
    }
  },
);

productsRouter.patch(
  '/:id',
  authMiddleware,
  validateProducts,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const productExistence = await Product.findProductById(id);
      if (!productExistence) {
        throw new NotFoundException('상품을 찾을 수가 없습니다.');
      }
      const updatedProduct = await Product.updateProduct(id, req.body);
      res.json({
        success: true,
        message: '등록된 상품 내용이 수정되었습니다',
        ...updatedProduct,
      });
    } catch (err) {
      next(err);
    }
  },
);

productsRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const productExistence = await Product.findProductById(id);
    if (!productExistence) {
      throw new NotFoundException('상품을 찾을 수가 없습니다.');
    }
    const deletedProduct = await Product.deleteProduct(id);
    res.json({
      success: true,
      message: '상품이 삭제되었습니다',
      id: deletedProduct.id,
    });
  } catch (err) {
    next(err);
  }
});

productsRouter.get('/comments', parsePagination, async (req, res, next) => {
  try {
    const { comments, nextCursor } = await Comment.findCommentsInProduct(
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

productsRouter.get(
  '/:productId/comments',
  parsePagination,
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { comments, nextCursor } = await Comment.findCommentsByProductId({
        productId,
        ...req.pagination,
      });
      res.json({ success: true, list: comments, nextCursor });
    } catch (err) {
      next(err);
    }
  },
);

productsRouter.post(
  '/:productId/comments',
  authMiddleware,
  validateComments,
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const productExistence = await Product.findProductById(productId);
      if (!productExistence) {
        throw new NotFoundException(
          '댓글을 단 글을 찾을 수가 없어요. 어디다 댓글을 쓴거야?',
        );
      }
      const { content } = req.body;
      const parent = 'Product';
      const newProductComment = await Comment.createComment({
        content,
        parent,
        productId,
      });
      res.json({
        success: true,
        message: '댓글이 정상적으로 추가되었습니다',
        ...newProductComment,
      });
    } catch (err) {
      next(err);
    }
  },
);
