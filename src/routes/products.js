import express from 'express';

const mockItems = [
  {
    id: 0,
    name: '아이폰 15 프로',
    description: '가장 가벼운 프로 아이폰 입니다. USB-C 적용',
    price: 900000,
    tags: ['스마트폰', '애플'],
    createdAt: 1,
    updatedAt: 0,
  },
  {
    id: 1,
    name: '테스트1',
    description: '테스트1',
    price: 1,
    tags: ['테스트'],
    createdAt: 2,
    updatedAt: 0,
  },
  {
    id: 2,
    name: '테스트2',
    description: '테스트2',
    price: 2,
    tags: ['테스트'],
    createdAt: 3,
    updatedAt: 0,
  },
  {
    id: 3,
    name: '테스트3',
    description: '테스트3',
    price: 3,
    tags: ['테스트'],
    createdAt: 4,
    updatedAt: 0,
  },
];

let nextId = Math.max(...mockItems.map((item) => item.id)) + 1;

export const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const keyword = req.query.keyword;
  const orderBy = req.query.orderBy;
  const offset = (page - 1) * pageSize;

  let filteredItems = mockItems;

  if (keyword) {
    filteredItems = mockItems.filter(
      (item) =>
        item.name.includes(keyword) || item.description.includes(keyword),
    );
  }

  if (orderBy === 'recent') {
    filteredItems = [...filteredItems].sort(
      (a, b) => b.createdAt - a.createdAt,
    );
  }

  const paginatedItems = filteredItems.slice(offset, offset + pageSize);

  const responseItems = paginatedItems.map(
    ({ id, name, price, createdAt }) => ({ id, name, price, createdAt }),
  );

  res.json({
    success: true,
    data: responseItems,
    page,
    pageSize,
    total: filteredItems.length,
  });
});

productsRouter.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = mockItems.find((item) => item.id === id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: '상품을 찾을 수 없습니다',
    });
  }

  res.json({ success: true, data: item });
});

productsRouter.post('/', (req, res) => {
  const { name, description, price, tags } = req.body;
  const newItem = {
    id: nextId++,
    name,
    description,
    price,
    tags,
    createdAt: new Date().toISOString(),
  };

  mockItems.push(newItem);
  res.status(201).json({
    success: true,
    data: newItem,
    message: '상품이 정상적으로 추가되었습니다',
  });
});

productsRouter.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, description, price, tags } = req.body;

  const patchIndex = mockItems.findIndex((item) => item.id === id);
  if (patchIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '상품을 찾을 수 없습니다',
    });
  }

  const patchedItem = {
    ...mockItems[patchIndex], // 기존 데이터 유지
    ...(name && { name }),
    ...(description && { description }),
    ...(price && { price }),
    ...(tags && { tags }),
    updatedAt: new Date().toISOString(),
  };
  mockItems[patchIndex] = patchedItem;

  res.json({
    success: true,
    data: patchedItem,
    message: '등록된 상품 내용이 수정되었습니다',
  });
});

productsRouter.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleteIndex = mockItems.findIndex((item) => item.id === id);

  if (deleteIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '상품을 찾을 수 없습니다',
    });
  }

  const [deletedItem] = mockItems.splice(deleteIndex, 1);

  res.json({
    success: true,
    data: deletedItem,
    message: '상품이 삭제되었습니다',
  });
});
