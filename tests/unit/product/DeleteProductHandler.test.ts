jest.mock('../../../src/infra/prismaClient');

import { DeleteProductHandler } from '../../../src/application/product/DeleteProductHandler';
import { prismaMock } from '../../helpers/prismaMock';
import { createMockProduct, createMockRequester } from '../../helpers/fixtures';
import { NotFoundException } from '../../../src/exceptions/NotFoundException';
import { ForbiddenException } from '../../../src/exceptions/ForbiddenException';
import { prismaClient } from '../../../src/infra/prismaClient';

(prismaClient as any) = prismaMock;

describe('DeleteProductHandler', () => {
  const productOwnerId = 1;
  const mockRequester = createMockRequester(productOwnerId);
  const existingProduct = createMockProduct({
    id: 100,
    ownerId: productOwnerId,
    name: '삭제할 상품',
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('본인 소유 상품을 삭제해야 한다', async () => {
    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      const mockTx = {
        product: {
          findUnique: jest.fn().mockResolvedValue(existingProduct),
          delete: jest.fn().mockResolvedValue(existingProduct),
        },
      };
      return callback(mockTx as any);
    });

    await expect(
      DeleteProductHandler.handle(mockRequester, { productId: existingProduct.id })
    ).resolves.not.toThrow();
  });

  test('존재하지 않는 상품 삭제 시 NotFoundException', async () => {
    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      const mockTx = {
        product: {
          findUnique: jest.fn().mockResolvedValue(null),
          delete: jest.fn(),
        },
      };
      return callback(mockTx as any);
    });

    await expect(
      DeleteProductHandler.handle(mockRequester, { productId: 999 })
    ).rejects.toThrow(NotFoundException);
  });

  test('타인의 상품 삭제 시 ForbiddenException을 던져야 한다', async () => {
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
          delete: jest.fn(),
        },
      };
      return callback(mockTx as any);
    });

    await expect(
      DeleteProductHandler.handle(mockRequester, { productId: otherUserProduct.id })
    ).rejects.toThrow(ForbiddenException);
  });

  test('삭제 전 권한 검증 필요요', async () => {
    let findUniqueCalled = false;
    let deleteCalled = false;

    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      const mockTx = {
        product: {
          findUnique: jest.fn().mockImplementation(async () => {
            findUniqueCalled = true;
            return existingProduct;
          }),
          delete: jest.fn().mockImplementation(async () => {
            deleteCalled = true;
            return existingProduct;
          }),
        },
      };
      return callback(mockTx as any);
    });

    await DeleteProductHandler.handle(mockRequester, { productId: existingProduct.id });

    expect(findUniqueCalled).toBe(true);
    expect(deleteCalled).toBe(true);
  });
});
