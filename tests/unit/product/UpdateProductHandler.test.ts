jest.mock('../../../src/infra/prismaClient');

import { UpdateProductHandler } from '../../../src/application/product/UpdateProductHandler';
import { prismaMock } from '../../helpers/prismaMock';
import { createMockProduct, createMockRequester } from '../../helpers/fixtures';
import { NotFoundException } from '../../../src/exceptions/NotFoundException';
import { ForbiddenException } from '../../../src/exceptions/ForbiddenException';
import { prismaClient } from '../../../src/infra/prismaClient';

(prismaClient as any) = prismaMock;

describe('UpdateProductHandler', () => {
  const productOwnerId = 1;
  const mockRequester = createMockRequester(productOwnerId);
  const existingProduct = createMockProduct({
    id: 100,
    ownerId: productOwnerId,
    name: '기존 상품',
    description: '기존 설명',
    price: 10000,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('본인 소유 상품을 수정해야 함함', async () => {
    const updateData = {
      productId: existingProduct.id,
      name: '수정된 상품',
      description: '수정된 설명',
      price: 20000,
      tags: ['수정', '태그'],
      images: ['https://example.com/updated.jpg'],
    };

    const updatedProduct = createMockProduct({
      ...existingProduct,
      ...updateData,
    });

    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      const mockTx = {
        product: {
          findUnique: jest.fn().mockResolvedValue(existingProduct),
          update: jest.fn().mockResolvedValue(updatedProduct),
        },
      };
      return callback(mockTx as any);
    });

    const result = await UpdateProductHandler.handle(mockRequester, updateData);

    expect(result.name).toBe(updateData.name);
    expect(result.price).toBe(updateData.price);
  });

  test('없는 상품 수정하면 NotFoundException', async () => {
    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      const mockTx = {
        product: {
          findUnique: jest.fn().mockResolvedValue(null),
          update: jest.fn(),
        },
      };
      return callback(mockTx as any);
    });

    const updateData = {
      productId: 999,
      name: '수정된 상품',
    };

    await expect(
      UpdateProductHandler.handle(mockRequester, updateData)
    ).rejects.toThrow(NotFoundException);
  });

  test('타인의 상품 수정 시 ForbiddenException을 던져야 한다', async () => {
    const otherUserId = 999;
    const otherUserProduct = createMockProduct({
      id: 100,
      ownerId: otherUserId,
      name: '타인의 상품',
    });

    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      const mockTx = {
        product: {
          findUnique: jest.fn().mockResolvedValue(otherUserProduct),
          update: jest.fn(),
        },
      };
      return callback(mockTx as any);
    });

    const updateData = {
      productId: otherUserProduct.id,
      name: '수정 시도',
    };

    await expect(
      UpdateProductHandler.handle(mockRequester, updateData)
    ).rejects.toThrow(ForbiddenException);
  });

  test('부분 업데이트트 가능', async () => {
    const updateData = {
      productId: existingProduct.id,
      name: '이름만 수정',
    };

    const updatedProduct = createMockProduct({
      ...existingProduct,
      name: updateData.name,
    });

    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      const mockTx = {
        product: {
          findUnique: jest.fn().mockResolvedValue(existingProduct),
          update: jest.fn().mockResolvedValue(updatedProduct),
        },
      };
      return callback(mockTx as any);
    });

    const result = await UpdateProductHandler.handle(mockRequester, updateData);

    expect(result.name).toBe(updateData.name);
    expect(result.description).toBe(existingProduct.description);
  });
});
