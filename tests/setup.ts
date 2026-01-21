
// 테스트 환경 변수 설정
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jwt';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.HTTP_PORT = '3001';

// 타임아웃 설정
jest.setTimeout(10000);

// 테스트 실행 전 전역 설정
beforeAll(() => {
  console.log(' 테스트 시작');
});

// 모든 테스트 완료 후
afterAll(() => {
  console.log('테스트 완료!');
});
