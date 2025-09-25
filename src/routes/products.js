import express from 'express';

export const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
  res.json({ products: [] });
});

productsRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ itemId: id });
});

productsRouter.get('/', (req, res) => {
  const { saerch } = req.query;
  res.json({ saerch: saerch });
});

productsRouter.post('/', (req, res) => {
  const { name, email } = req.body;
  res.json({ message: '상품 생성됨', name, email });
});

productsRouter.put('/:id', (req, res) => {
  res.json({ message: `상품 ${req.params.id} 업데이트` });
});

productsRouter.delete('/:id', (req, res) => {
  res.json({ message: `상품 ${req.params.id} 삭제` });
});
