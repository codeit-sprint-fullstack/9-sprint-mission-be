jest.mock('../../../src/infra/prismaClient');
jest.mock('../../../src/infra/AuthTokenManager');
jest.mock('../../../src/infra/UserPasswordBuilder');

import { SignUpLocalUserHandler } from '../../../src/application/auth/SignUpLocalUserHandler';
import { prismaMock } from '../../helpers/prismaMock';
import { createMockUser } from '../../helpers/fixtures';
import { UnprocessableEntityException } from '../../../src/exceptions/UnprocessableEntityException';
import { prismaClient } from '../../../src/infra/prismaClient';
import { AuthTokenManager } from '../../../src/infra/AuthTokenManager';
import { UserPasswordBuilder } from '../../../src/infra/UserPasswordBuilder';

(prismaClient as any) = prismaMock;

(AuthTokenManager.buildAccessToken as jest.Mock) = jest.fn(() => 'mock-access-token');
(AuthTokenManager.buildRefreshToken as jest.Mock) = jest.fn(() => 'mock-refresh-token');
(UserPasswordBuilder.hashPassword as jest.Mock) = jest.fn((password) => `hashed-${password}`);

describe('SignUpLocalUserHandler', () => {
  const signUpData = {
    email: 'newuser@example.com',
    nickname: '새유저',
    password: 'password123',
    passwordConfirmation: 'password123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('회원가입 처리', async () => {
    const mockCreatedUser = createMockUser({
      id: 1,
      email: signUpData.email,
      nickname: signUpData.nickname,
      password: 'hashed-password123',
    });

    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(mockCreatedUser);
    prismaMock.refreshToken.create.mockResolvedValue({
      id: 1,
      userId: mockCreatedUser.id,
      token: 'mock-refresh-token',
      createdAt: new Date(),
    });

    const result = await SignUpLocalUserHandler.handle(signUpData);

    expect(result).toEqual({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: mockCreatedUser.id,
        email: mockCreatedUser.email,
        nickname: mockCreatedUser.nickname,
        image: mockCreatedUser.image,
        createdAt: mockCreatedUser.createdAt,
        updatedAt: mockCreatedUser.updatedAt,
      },
    });

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: signUpData.email },
    });

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        email: signUpData.email,
        nickname: signUpData.nickname,
        password: 'hashed-password123',
      },
    });
  });

  test('비밀번호랑 비밀번호 확인 다르면 UnprocessableEntityException', async () => {
    const invalidData = {
      ...signUpData,
      passwordConfirmation: 'different-password',
    };

    await expect(
      SignUpLocalUserHandler.handle(invalidData)
    ).rejects.toThrow(UnprocessableEntityException);

    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  test('이미 있는 이메일이면 UnprocessableEntityException', async () => {
    const existingUser = createMockUser({
      email: signUpData.email,
    });

    prismaMock.user.findUnique.mockResolvedValue(existingUser);

    await expect(
      SignUpLocalUserHandler.handle(signUpData)
    ).rejects.toThrow(UnprocessableEntityException);

    expect(prismaMock.user.findUnique).toHaveBeenCalled();
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  test('해시된 비밀번호 저장', async () => {
    const mockCreatedUser = createMockUser({
      email: signUpData.email,
      password: 'hashed-password123',
    });

    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(mockCreatedUser);
    prismaMock.refreshToken.create.mockResolvedValue({
      id: 1,
      userId: 1,
      token: 'token',
      createdAt: new Date(),
    });

    await SignUpLocalUserHandler.handle(signUpData);

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        password: 'hashed-password123',
      }),
    });
  });

  test('회원가입시  accessToken, refreshToken 발급', async () => {
    const mockCreatedUser = createMockUser({ id: 100 });

    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(mockCreatedUser);
    prismaMock.refreshToken.create.mockResolvedValue({
      id: 1,
      userId: 100,
      token: 'mock-refresh-token',
      createdAt: new Date(),
    });

    const result = await SignUpLocalUserHandler.handle(signUpData);

    expect(result.accessToken).toBe('mock-access-token');
    expect(result.refreshToken).toBe('mock-refresh-token');
    expect(result.user.id).toBe(100);
  });
});
