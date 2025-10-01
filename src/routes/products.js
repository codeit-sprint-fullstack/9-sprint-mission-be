import express from 'express';
import { productRepository as Product } from '../repository/product.repository.js';
import { validateProducts } from '../middlewares/validateProducts.js';
import { NotFoundException } from '../err/notFoundException.js';

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
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
});

productsRouter.post('/', validateProducts, async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    const newProduct = await Product.createProduct({
      name,
      description,
      price,
      tags,
    });
    res.status(201).json({
      success: true,
      data: newProduct,
      message: '상품이 정상적으로 추가되었습니다',
    });
  } catch (err) {
    next(err);
  }
});

productsRouter.patch('/:id', validateProducts, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.updateProduct(id, req.body);
    if (!updatedProduct) {
      throw new NotFoundException('상품을 찾을 수 없습니다');
    }
    res.json({
      success: true,
      data: updatedProduct,
      message: '등록된 상품 내용이 수정되었습니다',
    });
  } catch (err) {
    next(err);
  }
});

productsRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.deleteProduct(id);
    if (!deletedProduct) {
      throw new NotFoundException('상품을 찾을 수 없습니다');
    }
    res.json({
      success: true,
      data: deletedProduct,
      message: '상품이 삭제되었습니다',
    });
  } catch (err) {
    next(err);
  }
});
