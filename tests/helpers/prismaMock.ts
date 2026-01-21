

import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Prisma Client를 Deep Mock으로 생성
export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

// 각 테스트 전에 mock 초기화
beforeEach(() => {
  mockReset(prismaMock);
});

