jest.mock('../../../src/infra/prismaClient');

import { CreateProductHandler } from '../../../src/application/product/CreateProductHandler';
import { prismaMock } from '../../helpers/prismaMock';
import { createMockProduct, createMockRequester } from '../../helpers/fixtures';
import { prismaClient } from '../../../src/infra/prismaClient';

(prismaClient as any) = prismaMock;

describe('CreateProductHandler', () => {
  const mockRequester = createMockRequester(1);
  const productData = {
    name: '테스트 상품',
    description: '테스트 상품 설명',
    price: 10000,
    tags: ['테스트', '샘플'],
    images: ['https://example.com/image.jpg'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('상품 생성', async () => {
    const mockCreatedProduct = createMockProduct({
      id: 1,
      ownerId: mockRequester.userId,
      ...productData,
    });

    prismaMock.product.create.mockResolvedValue(mockCreatedProduct);

    const result = await CreateProductHandler.handle(mockRequester, productData);

    expect(result).toEqual({
      id: mockCreatedProduct.id,
      ownerId: mockCreatedProduct.ownerId,
      name: mockCreatedProduct.name,
      description: mockCreatedProduct.description,
      price: mockCreatedProduct.price,
      tags: mockCreatedProduct.tags,
      images: mockCreatedProduct.images,
      createdAt: mockCreatedProduct.createdAt,
    });

    expect(prismaMock.product.create).toHaveBeenCalledWith({
      data: {
        ownerId: mockRequester.userId,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        tags: productData.tags,
        images: productData.images,
      },
    });
  });

  test('로그인한 사용자 ID가 ownerId로 설정됨', async () => {
    const userId = 999;
    const requester = createMockRequester(userId);
    const mockCreatedProduct = createMockProduct({
      id: 1,
      ownerId: userId,
      ...productData,
    });

    prismaMock.product.create.mockResolvedValue(mockCreatedProduct);

    const result = await CreateProductHandler.handle(requester, productData);

    expect(result.ownerId).toBe(userId);
  });

  test('빈 태그랑 이미지 배열도 가능함', async () => {
    const minimalProductData = {
      name: '최소 상품',
      description: '최소 설명',
      price: 1000,
      tags: [],
      images: [],
    };

    const mockCreatedProduct = createMockProduct({
      id: 1,
      ownerId: mockRequester.userId,
      ...minimalProductData,
    });

    prismaMock.product.create.mockResolvedValue(mockCreatedProduct);

    const result = await CreateProductHandler.handle(mockRequester, minimalProductData);

    expect(result.tags).toEqual([]);
    expect(result.images).toEqual([]);
  });
});
