import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "../constant/env";

export interface Requester {
  userId: number;
}

export class AuthTokenManager {
  /**
   * 현재 시각으로부터 1시간동안 유효한 액세스 토큰을 생성합니다.
   */
  static buildAccessToken(payload: Requester): string {
    return jwt.sign(
      {
        user: {
          id: payload.userId,
        },
      },
      JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
  }

  /**
   * 주어진 액세스 토큰이 유효한지 검증합니다.
   */
  static isValidAccessToken(accessToken: string): boolean {
    try {
      jwt.verify(accessToken, JWT_ACCESS_TOKEN_SECRET);

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 현재 시각으로부터 14일동안 유효한 리프레시 토큰을 생성합니다.
   */
  static buildRefreshToken(payload: Requester): string {
    return jwt.sign(
      {
        user: {
          id: payload.userId,
        },
      },
      JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: "14d",
      }
    );
  }

  static isValidRefreshToken(refreshToken: string): boolean {
    try {
      jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET);

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 액세스 토큰 또는 리프래시 토큰으로부터 요청자 정보를 추출합니다.
   */
  static getRequesterFromToken(authorizationHeaderValue: string = ""): Requester {
    const jwtToken = authorizationHeaderValue.split(" ")[1];

    const jwtPayload = jwt.decode(jwtToken);

    if (!jwtPayload || typeof jwtPayload === "string") {
      return {
        userId: -1,
      };
    }

    return {
      userId: jwtPayload.user.id,
    };
  }

  static getRequesterFromTokenOrDefault(
    authorizationHeaderValue: string = ""
  ): Requester {
    try {
      return this.getRequesterFromToken(authorizationHeaderValue);
    } catch (e) {
      return {
        userId: -1, // GUEST
      };
    }
  }
}
