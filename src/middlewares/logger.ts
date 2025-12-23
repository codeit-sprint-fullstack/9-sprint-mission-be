import type { Request, Response, NextFunction, RequestHandler } from "express";

/** 모든 인바운드 요청을 기록하는 로거 미들웨어 */
export const logger: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();

  // req.url 대신 originalUrl로 전체 경로(쿼리 스트링 포함)확인 가능
  // morgan과 같이 사용으로 추가 확장(user agent - device, browser etc...)
  console.log(
    `[${timestamp}] (${req.method} ${req.originalUrl}) - Agent: ${req.headers["user-agent"]}`
  );

  next();
};
