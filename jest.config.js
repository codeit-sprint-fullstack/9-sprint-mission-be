/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  
  // 테스트 실행 환경
  testEnvironment: 'node',
  
  // 테스트 파일 경로 패턴
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.spec.ts',
  ],
  
  // 모듈 경로 매핑 (tsconfig.json의 paths와 동일하게)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // 커버리지 수집 대상
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.ts', // 메인 진입점은 제외
    '!src/**/index.ts',
  ],
  
  // 커버리지 리포트 디렉토리
  coverageDirectory: 'coverage',
  
  // 커버리지 리포트 형식
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
  ],
  
  // 커버리지 임계값 
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // 테스트 전역 설정 파일
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // 테스트 타임아웃 (밀리초)
  testTimeout: 10000,
  
  // 각 테스트 실행 전후 자동으로 mock 초기화
  clearMocks: true,
  restoreMocks: true,
  
  // 상세한 출력
  verbose: true,
  
  // TypeScript 변환 설정
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          // 테스트용 TypeScript 설정
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  
  // node_modules는 변환하지 않음
  transformIgnorePatterns: [
    'node_modules/(?!(supertest)/)',
  ],
  
  // 모듈 파일 확장자
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  // 테스트 실행 전 환경 변수 설정
  globalSetup: undefined,
  globalTeardown: undefined,
};
