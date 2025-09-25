import express from 'express';

const mokItems = [
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

let newId = 1;

export const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const keyword = req.query.keyword;
  const offset = (page - 1) * pageSize;

  const responsItems = keyword
    ? mokItems
        .filter((item) => {
          item.name.includes(keyword) || item.description.includes(keyword);
        })
        .slice(offset, offset + pageSize)
        .map((item) => {
          (item.id, item.name, item.price, item.createdAt);
        })
    : mokItems.slice(offset, offset + pageSize).map((item) => {
        (item.id, item.name, item.price, item.createdAt);
      });

  res.json({
    success: true,
    data: responsItems,
    page,
    pageSize,
    offset,
    total: mokItems.length,
  });
});

productsRouter.get('/:id', (req, res) => {
  const { id } = parseInt(req.params.id);
  const patchIndex = mokItems.findIndex((u) => u.id === id);
  if (patchIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '상품을 찾을 수 없습니다',
    });
  }

  const responsItem = mokItems.find((item) => item.id === id);

  res.json({ success: true, data: responsItem });
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
