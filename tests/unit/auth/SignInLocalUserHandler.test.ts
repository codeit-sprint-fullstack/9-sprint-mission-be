jest.mock('../../../src/infra/prismaClient');
jest.mock('../../../src/infra/AuthTokenManager');
jest.mock('../../../src/infra/UserPasswordBuilder');

import { SignInLocalUserHandler } from '../../../src/application/auth/SignInLocalUserHandler';
import { prismaMock } from '../../helpers/prismaMock';
import { createMockUser } from '../../helpers/fixtures';
import { NotFoundException } from '../../../src/exceptions/NotFoundException';
import { prismaClient } from '../../../src/infra/prismaClient';
import { AuthTokenManager } from '../../../src/infra/AuthTokenManager';
import { UserPasswordBuilder } from '../../../src/infra/UserPasswordBuilder';

(prismaClient as any) = prismaMock;

(AuthTokenManager.buildAccessToken as jest.Mock) = jest.fn(() => 'mock-access-token');
(AuthTokenManager.buildRefreshToken as jest.Mock) = jest.fn(() => 'mock-refresh-token');
(UserPasswordBuilder.hashPassword as jest.Mock) = jest.fn((password) => `hashed-${password}`);

describe('SignInLocalUserHandler', () => {
  const signInData = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('로그인 처리', async () => {
    const mockUser = createMockUser({
      id: 1,
      email: signInData.email,
      password: 'hashed-password123',
    });

    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.refreshToken.create.mockResolvedValue({
      id: 1,
      userId: mockUser.id,
      token: 'mock-refresh-token',
      createdAt: new Date(),
    });

    const result = await SignInLocalUserHandler.handle(signInData);

    expect(result).toEqual({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: mockUser.id,
        email: mockUser.email,
        nickname: mockUser.nickname,
        image: mockUser.image,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      },
    });

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: signInData.email },
    });
  });

  test('없는 이메일로 로그인하면 NotFoundException', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(
      SignInLocalUserHandler.handle(signInData)
    ).rejects.toThrow(NotFoundException);
  });

  test('맞는 비밀번호가 없으면 NotFoundException', async () => {
    const mockUser = createMockUser({
      email: signInData.email,
      password: 'hashed-different-password',
    });

    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    await expect(
      SignInLocalUserHandler.handle(signInData)
    ).rejects.toThrow(NotFoundException);
  });

  test('로그인 시 accessToken이랑 refreshToken 발급', async () => {
    const mockUser = createMockUser({
      id: 100,
      email: signInData.email,
      password: 'hashed-password123',
    });

    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.refreshToken.create.mockResolvedValue({
      id: 1,
      userId: 100,
      token: 'mock-refresh-token',
      createdAt: new Date(),
    });

    const result = await SignInLocalUserHandler.handle(signInData);

    expect(result.accessToken).toBe('mock-access-token');
    expect(result.refreshToken).toBe('mock-refresh-token');
  });

  test('refreshToken DB에 저장됨', async () => {
    const mockUser = createMockUser({
      id: 1,
      email: signInData.email,
      password: 'hashed-password123',
    });

    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.refreshToken.create.mockResolvedValue({
      id: 1,
      userId: mockUser.id,
      token: 'mock-refresh-token',
      createdAt: new Date(),
    });

    await SignInLocalUserHandler.handle(signInData);

    expect(prismaMock.refreshToken.create).toHaveBeenCalledWith({
      data: {
        userId: mockUser.id,
        token: 'mock-refresh-token',
      },
    });
  });
});
