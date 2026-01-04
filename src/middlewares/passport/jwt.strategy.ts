import type { Request } from "express";
import {
  Strategy as JwtStrategy,
  StrategyOptions,
  VerifiedCallback,
} from "passport-jwt";
import { authRepository } from "../../repositories/auth.repository";
import { config } from "@config/config";

/** JWT Payload type alias */
type JwtPayload = {
  userId: string;
  iat?: number;
  exp?: number;
};

/** cookie -> AccessToken 추출 */
const accessTokenExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies["accessToken"] || null;
  }
  return null;
};

/** cookie -> RefreshToken 추출 */
const refreshTokenExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies["refreshToken"] || null;
  }
  return null;
};

/** AccessToken 전략 옵션 */
const accessTokenOptions: StrategyOptions = {
  jwtFromRequest: accessTokenExtractor,
  secretOrKey: config.JWT_SECRET,
};

/** RefreshToken 전략 옵션 */
const refreshTokenOptions: StrategyOptions = {
  jwtFromRequest: refreshTokenExtractor,
  secretOrKey: config.JWT_SECRET,
};

/** JWT 검증 공통 로직 */
async function jwtVerify(
  payload: JwtPayload,
  done: VerifiedCallback
): Promise<void> {
  try {
    const user = await authRepository.findById(payload.userId);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}

const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);
const refreshTokenStrategy = new JwtStrategy(refreshTokenOptions, jwtVerify);

export { accessTokenStrategy, refreshTokenStrategy };
