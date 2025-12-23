import type { Request, Response, NextFunction, RequestHandler } from "express";
/** TODO: express-jwt , passport 중  하나만 선택 */
import { expressjwt } from "express-jwt";
import passport from "../config/passport";
import { HttpStatus } from "../common/constants/httpStatus";
import { ALREADY_AUTHENTICATED } from "../common/constants/errorMessage";
import { config } from "@config/config";

/**
 *  Access  Token 검증 미들웨어
 *  express-jwt -> success -> req.auth에 페이로드를 담는다.
 */
const verifyAccessToken: RequestHandler = expressjwt({
  secret: config.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => {
    if (req.cookies && req.cookies.accessToken) {
      return req.cookies.accessToken;
    }
    return undefined;
  },
});

/** passport 사용한 미들웨어 */
const requireRefreshToken: RequestHandler = passport.authenticate(
  "refresh-token",
  { session: false }
);

const requireGoogleStrategy: RequestHandler = passport.authenticate("google");
const requireGoogleScope: RequestHandler = passport.authenticate("google", {
  scope: ["profile", "email"],
});

/**
 * 로그인 상태 확인 미들웨어
 * 미들웨어는 성공 시 다음 단계로 void
 * 응답 종료시 Response해야함
 */
const alreadyAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> | undefined => {
  const { accessToken } = req.cookies;
  if (accessToken) {
    return res.status(HttpStatus.FORBIDDEN).json({
      success: false,
      message: ALREADY_AUTHENTICATED,
    });
  }
  next();
};

export const auth = {
  verifyAccessToken,
  requireRefreshToken,
  requireGoogleStrategy,
  requireGoogleScope,
  alreadyAuthenticated,
};
