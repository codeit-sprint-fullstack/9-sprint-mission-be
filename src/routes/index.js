import express from 'express';
import { productsRouter } from './products.js';
import { articlesRouter } from './articles.js';
import { commentsRouter } from './comments.js';
import { authRouter } from './auth.js';

export const router = express.Router();

// 기본 라우트
router.get('/', (req, res) => {
  res.json({
    message: 'Hello Express!',
    timestamp: new Date().toISOString(),
  });
});

// 하위 라우트 등록
router.use('/products', productsRouter);
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);
router.use('/auth', authRouter);
