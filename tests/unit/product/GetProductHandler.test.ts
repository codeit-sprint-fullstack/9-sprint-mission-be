jest.mock('../../../src/infra/prismaClient');

import { GetProductHandler } from '../../../src/application/product/GetProductHandler';
import { prismaMock } from '../../helpers/prismaMock';
import { createMockProduct, createMockRequester } from '../../helpers/fixtures';
import { NotFoundException } from '../../../src/exceptions/NotFoundException';
import { prismaClient } from '../../../src/infra/prismaClient';

(prismaClient as any) = prismaMock;

describe('GetProductHandler', () => {
  const mockRequester = createMockRequester(1);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('정상적으로 상품을 조회해야 함함', async () => {
    const mockProduct = createMockProduct({
      id: 1,
      ownerId: 1,
      name: '테스트 상품',
      price: 10000,
    });

    const mockProductWithLikes = {
      ...mockProduct,
      likes: [{ id: 1, userId: 1 }],
    };

    prismaMock.product.findUnique.mockResolvedValue(mockProductWithLikes as any);

    const result = await GetProductHandler.handle(mockRequester, { productId: 1 });

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('price');
    expect(result).toHaveProperty('favoriteCount');
    expect(result).toHaveProperty('isFavorite');
  });

  test('존재하지 않는 상품 조회 시 NotFoundException', async () => {
    prismaMock.product.findUnique.mockResolvedValue(null);

    await expect(
      GetProductHandler.handle(mockRequester, { productId: 999 })
    ).rejects.toThrow(NotFoundException);
  });

  test('좋아요 정보를 포함하여 조회', async () => {
    const mockProduct = createMockProduct({ id: 1, ownerId: 2 });
    const mockProductWithLikes = {
      ...mockProduct,
      likes: [
        { id: 1, userId: 1 },
        { id: 2, userId: 3 },
      ],
    };

    prismaMock.product.findUnique.mockResolvedValue(mockProductWithLikes as any);

    const result = await GetProductHandler.handle(mockRequester, { productId: 1 });

    expect(result.favoriteCount).toBe(2);
  });
});
