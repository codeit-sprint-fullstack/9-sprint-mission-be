import express from 'express';
import { Product } from '../models/product.model.js';
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

    const query = {};
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    const sortOptions = {};
    if (orderBy === 'recent') {
      sortOptions.createdAt = -1;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(offset)
      .limit(pageSize)
      .select('id name price createdAt');

    res.json({
      success: true,
      data: products,
      page,
      pageSize,
      total,
    });
  } catch (err) {
    next(err);
  }
});

productsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
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
    const newProduct = await Product.create({ name, description, price, tags });
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
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
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
    const deletedProduct = await Product.findByIdAndDelete(id);
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
