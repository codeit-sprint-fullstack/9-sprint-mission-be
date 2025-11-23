import { HttpStatus } from "../common/constants/index.js";

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  signUp = async (req, res, next) => {
    try {
      const { email, nickname, password } = req.body;

      const user = await this.authService.createUser({
        email,
        nickname,
        password,
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "회원가입이 완료되었습니다.",
        data: user,
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await this.authService.getUser({
        email,
        password,
      });

      const accessToken = this.authService.createToken(user);
      const refreshToken = this.authService.createToken(user, "refresh");
      await this.authService.updateUser(user.id, { refreshToken });

      res.cookie("accessToken", accessToken, this.getCookieOptions("access"));

      res.cookie(
        "refreshToken",
        refreshToken,
        this.getCookieOptions("refresh")
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "로그인에 성공하였습니다.",
        data: user,
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      const { id: userId } = req.user;

      const { newAccessToken, newRefreshToken } =
        await this.authService.refreshToken(userId, refreshToken);

      res.cookie(
        "accessToken",
        newAccessToken,
        this.getCookieOptions("access")
      );
      res.cookie(
        "refreshToken",
        newRefreshToken,
        this.getCookieOptions("refresh")
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "토큰이 갱신되었습니다.",
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  googleCallback = async (req, res, next) => {
    try {
      const accessToken = this.authService.createToken(req.user);
      const refreshToken = this.authService.createToken(req.user, "refresh");
      res.cookie("accessToken", accessToken, this.getCookieOptions("access"));
      res.cookie(
        "refreshToken",
        refreshToken,
        this.getCookieOptions("refresh")
      );

      return res.redirect("http://localhost:3000/items");
    } catch (error) {
      next(error);
      return;
    }
  };

  signOut = async (req, res, next) => {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.status(HttpStatus.OK).json({
        success: true,
        message: "로그아웃 되었습니다.",
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  // --- helper ---
  getCookieOptions = (type) => {
    const isProduction = process.env.NODE_ENV === "production";
    const maxAge =
      type === "refresh" ? 14 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000;
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge,
    };
  };
}
