import express from 'express';

const mokItems = [
  {
    id: 0,
    name: '아이폰 15 프로',
    description: '가장 가벼운 프로 아이폰 입니다. USB-C 적용',
    price: 900000,
    tags: ['스마트폰', '애플'],
    createdAt: 1,
    updatedAt: 1,
  },
];

let newId = 1;

export const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
  res.json({ success: true, data: mokItems, count: mokItems.length });
});

productsRouter.get('/:id', (req, res) => {
  const { id } = parseInt(req.params.id);
  res.json({ productsId: id });
});

productsRouter.get('/', (req, res) => {
  const { saerch } = req.query;
  res.json({ saerch: saerch });
});

productsRouter.post('/', (req, res) => {
  const { name, description, price, tags } = req.body;
  const newItem = {
    id: newId++,
    name,
    description,
    price,
    tags,
    createdAt: new Date().toISOString(),
  };
  mokItems.push(newItem);
  res.status(201).json({
    success: true,
    data: newItem,
    message: '상품이 정상적으로 추가되었습니다',
  });
});

productsRouter.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, price, tags } = req.body;

  const patchIndex = mokItems.findIndex((u) => u.id === id);
  if (patchIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '상품을 찾을 수 없습니다',
    });
  }
  mokItems[patchIndex] = {
    name,
    description,
    price,
    tags,
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    data: mokItems[patchIndex],
    message: '등록된 상품 내용이 수정되었습니다',
  });
});

productsRouter.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const deleteIndex = mokItems.findIndex((u) => u.id === id);

  if (deleteIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '상품을 찾을 수 없습니다',
    });
  }

  const deletedItem = mokItems[deleteIndex];
  mokItems.splice(deleteIndex, 1);

  res.json({
    success: true,
    data: deletedItem,
    message: '상품이 삭제되었습니다',
  });
});
