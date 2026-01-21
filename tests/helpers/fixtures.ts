

import { User, Product, Article, Comment, Like } from '@prisma/client';

// 샘플 사용자 데이터
export const mockUsers: User[] = [
  {
    id: 1,
    email: 'test@example.com',
    password: '$2b$10$abcdefghijklmnopqrstuv', // hashed password
    nickname: '테스트유저',
    image: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    email: 'user2@example.com',
    password: '$2b$10$abcdefghijklmnopqrstuv',
    nickname: '사용자2',
    image: 'https://example.com/image.jpg',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

// 샘플 상품 데이터
export const mockProducts: Product[] = [
  {
    id: 1,
    name: '테스트 상품',
    description: '이것은 테스트 상품입니다.',
    price: 10000,
    tags: ['테스트', '샘플'],
    images: ['https://example.com/product1.jpg'],
    ownerId: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    name: '두번째 상품',
    description: '두번째 테스트 상품',
    price: 20000,
    tags: ['전자제품'],
    images: ['https://example.com/product2.jpg', 'https://example.com/product2-2.jpg'],
    ownerId: 2,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

// 샘플 게시글 데이터
export const mockArticles: Article[] = [
  {
    id: 1,
    title: '테스트 게시글',
    content: '테스트 게시글 내용입니다.',
    image: null,
    writerId: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// 샘플 댓글 데이터
export const mockComments: Comment[] = [
  {
    id: 1,
    content: '테스트 댓글입니다.',
    productId: 1,
    articleId: null,
    writerId: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// 샘플 좋아요 데이터
export const mockLikes: Like[] = [
  {
    id: 1,
    userId: 1,
    productId: 1,
    articleId: null,
    createdAt: new Date('2024-01-01'),
  },
];

// 유틸리티 함수: 새 사용자 생성
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 999,
  email: 'new@example.com',
  password: '$2b$10$abcdefghijklmnopqrstuv',
  nickname: '새유저',
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// 유틸리티 함수: 새 상품 생성
export const createMockProduct = (overrides?: Partial<Product>): Product => ({
  id: 999,
  name: '새 상품',
  description: '새 상품 설명',
  price: 10000,
  tags: [],
  images: [],
  ownerId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// 유틸리티 함수: Requester 객체 생성 (인증된 사용자)
export const createMockRequester = (userId = 1) => ({
  userId,
});
