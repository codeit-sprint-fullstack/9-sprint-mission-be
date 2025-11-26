// __tests__/auth.integration.test.js

import request from "supertest";
// src/server.js에서 Express 앱 인스턴스 (app)를 export 해야 합니다.
import { app } from "../server.js";
// prisma 클라이언트를 import하여 테스트 데이터 정리에 사용합니다.
import { prisma } from "../db/prisma.js";

// 💡 테스트에 사용할 공통 유저 데이터 정의
const TEST_USER = {
  email: "auth_test@example.com",
  nickname: "testUser",
  password: "testpassword123",
};

// 💡 테스트 상태 관리를 위한 변수
let accessToken;
let refreshTokenCookie;
let oldRefreshTokenCookie; // 슬라이딩 세션 검증을 위해 이전 토큰 저장

// ⚠️ 테스트 전 Access Token 만료 시간을 '1s' 등으로 매우 짧게 설정하면 토큰 만료 테스트를 진행하기 수월합니다.

describe("인증 및 슬라이딩 세션 통합 테스트 (Auth Integration Test)", () => {
  // --- 1. 테스트 환경 설정 및 클린업 ---

  // 모든 테스트 시작 전 실행: 테스트 유저가 이미 존재한다면 삭제합니다. (멱등성 보장)
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: TEST_USER.email } });
  });

  // 모든 테스트 완료 후 실행: 유저를 삭제하고 DB 연결을 끊습니다.
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: TEST_USER.email } });
    await prisma.$disconnect();
  });

  // --- 2. 회원가입 및 로그인 테스트 ---

  it("1. [POST /signUp] 유저 회원가입 성공 (201 Created)", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signUp")
      .send(TEST_USER)
      .expect(201); // 201 Created 확인

    expect(res.body.data.email).toBe(TEST_USER.email);
  });

  it("2. [POST /signUp] 중복 이메일로 회원가입 실패 (409 Conflict)", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signUp")
      .send(TEST_USER)
      .expect(409); // 409 Conflict 확인

    expect(res.body.message).toBeDefined();
  });

  it("3. [POST /signIn] 로그인 성공 및 초기 토큰 획득 (200 OK)", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signIn")
      .send({ email: TEST_USER.email, password: TEST_USER.password })
      .expect(200);

    // Access Token 획득 확인
    accessToken = res.body.data.accessToken;
    expect(accessToken).toBeDefined();

    // Refresh Token Cookie 획득 확인 및 저장
    const cookies = res.headers["set-cookie"];
    refreshTokenCookie = cookies.find((c) => c.startsWith("refreshToken"));

    expect(refreshTokenCookie).toBeDefined();

    // 5번 테스트를 위해 현재 유효한 리프레시 토큰을 oldRefreshTokenCookie에 저장해둡니다.
    oldRefreshTokenCookie = refreshTokenCookie;
  });

  it("4. [POST /signIn] 잘못된 비밀번호로 로그인 실패 (401 Unauthorized)", async () => {
    await request(app)
      .post("/api/v1/auth/signIn")
      .send({ email: TEST_USER.email, password: "wrong_password" })
      .expect(401); // 401 Unauthorized 확인
  });

  // --- 3. 슬라이딩 세션 및 토큰 갱신 테스트 ---

  it("5. [POST /refresh-token] 토큰 갱신 성공 및 새로운 토큰 획득 (Sliding Session)", async () => {
    const res = await request(app)
      .post("/api/v1/auth/refresh-token")
      .set("Cookie", [refreshTokenCookie]) // 현재 유효한 RT 쿠키 설정
      .expect(200);

    const newAccessToken = res.body.data.accessToken;
    const newCookies = res.headers["set-cookie"];
    const newRefreshTokenCookie = newCookies.find((c) =>
      c.startsWith("refreshToken")
    );

    // 새로운 Access Token이 발급되었는지 확인
    expect(newAccessToken).toBeDefined();
    expect(newAccessToken).not.toBe(accessToken);

    // ⭐️ 핵심: 리프레시 토큰이 DB 업데이트를 통해 바뀌었는지 확인 (Sliding Session)
    expect(newRefreshTokenCookie).toBeDefined();
    expect(newRefreshTokenCookie).not.toBe(refreshTokenCookie);

    // 다음 테스트를 위해 현재 유효한 토큰으로 업데이트
    refreshTokenCookie = newRefreshTokenCookie;
  });

  it("6. [POST /refresh-token] 이전에 사용했던 토큰으로 갱신 요청 시 실패 (401 - 보안 검증)", async () => {
    // 3번에서 획득하고 5번에서 사용된 '구형 토큰'을 다시 사용해봅니다.
    // DB에는 이미 최신 토큰이 저장되어 있으므로, 이 요청은 거부되어야 합니다.
    await request(app)
      .post("/api/v1/auth/refresh-token")
      .set("Cookie", [oldRefreshTokenCookie]) // 구형 토큰 설정
      .expect(401);
  });
});
