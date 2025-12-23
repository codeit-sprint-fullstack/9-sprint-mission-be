import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { BaseController } from "./base.controller.js";
import { config } from "@config/config.js";
import { UnAuthorizedException } from "../common/exceptions/error.js";

export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /** 회원가입 */
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, nickname, password } = req.body;
      const user = await this.authService.createUser({
        email,
        nickname,
        password,
      });

      return this.sendSuccess(res, user, "회원가입이 완료되었습니다.", 201);
    } catch (error) {
      this.nextError(next, error);
    }
  };

  /** 로그인 처리 (이메일 / 비밀번호) */
  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      // user가 맞는지 및 비밀번호 일치 하는지
      const user = await this.authService.getUser({
        email,
        password,
      });

      // AccessToken(short) | RefreshToken(longTerm)
      const accessToken = this.authService.createToken(user);
      const refreshToken = this.authService.createToken(user, "refresh");

      // RefreshToken은 DB에 저장 (추후 갱신시 대조)
      await this.authService.updateUser(user.id, { refreshToken });

      // Token => HttpOnly에 저장
      this.setAuthCookies(res, accessToken, refreshToken);

      return this.sendSuccess(res, user, "로그인에 성공하였습니다.");
    } catch (error) {
      this.nextError(next, error);
    }
  };

  /** AccessToken 만료 시 RefreshToken을 이용한 갱신*/
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.cookies;
      const userId = req.auth?.id;

      if (!userId) {
        throw new UnAuthorizedException("토큰 갱신을 위한 정보가 없습니다.");
      }

      // Token 유효성 검증후 새로운 토큰들 생성
      const { newAccessToken, newRefreshToken } =
        await this.authService.refreshToken(userId, refreshToken);

      // 새로운 토큰으로 쿠키갱신
      this.setAuthCookies(res, newAccessToken, newRefreshToken);

      return this.sendSuccess(res, null, "토큰이 갱신되었습니다.");
    } catch (error) {
      this.nextError(next, error);
    }
  };

  /** 구글 소셜 로그인 - 콜백 처리 */
  googleCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Passport Strategy를  통해 성공적으로 생성한  유저 객체
      const user = req.user;
      if (!user) throw new UnAuthorizedException("구글 인증 정보가 없습니다.");

      // 소셜 유저를 위한 토큰 생성
      const accessToken = this.authService.createToken(req.user);
      const refreshToken = this.authService.createToken(req.user, "refresh");

      this.setAuthCookies(res, accessToken, refreshToken);

      // 완료후 프론트엔드 특정페이지로 이동
      return res.redirect("http://localhost:3000/items");
    } catch (error) {
      this.nextError(next, error);
    }
  };

  /** 로그아웃 - 쿠키삭제*/
  signOut = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      // 사용했던 옵션들을 그대로 가져와서 삭제
      const options = this.getCookieOptions("access");
      const { maxAge, ...clearOptions } = options;

      res.clearCookie("accessToken", clearOptions);
      res.clearCookie("refreshToken", clearOptions);

      return this.sendSuccess(res, null, "로그아웃 되었습니다.");
    } catch (error) {
      this.nextError(next, error);
    }
  };

  // --- helper ---

  /** 쿠키 설정을 한번에 처리하는 헬퍼 */
  private setAuthCookies(res: Response, access: string, refresh: string) {
    res.cookie("accessToken", access, this.getCookieOptions("access"));
    res.cookie("refreshToken", refresh, this.getCookieOptions("refresh"));
  }

  /**
   * 환경별/타입별 쿠키 옵션 생성 헬퍼 
   * @param type  - 'access' or 'refresh' 토큰 구분
   */
  private getCookieOptions = (type: "access" | "refresh") => {
    const isProduction = config.NODE_ENV === "production";
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
      path: "/",
      maxAge: type === "refresh" ? 14 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000,
    };
  };
}
