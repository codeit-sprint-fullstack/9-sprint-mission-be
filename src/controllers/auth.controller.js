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
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "로그인에 성공하였습니다.",
        data: { ...user, accessToken },
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookie;
      const { id: userId } = req.user;

      const { newAccessToken, newRefreshToken } =
        await this.authService.refreshToken(userId, refreshToken);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/token/refresh",
      });
      return res.json({ accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req, res, next) => {
    const { accessToken } = req.cookie;
  };

  googleCallback = async (req, res, next) => {
    const accessToken = this.authService.createToken(req.user);
    const refreshToken = this.authService.createToken(req.user, "refresh");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.json({ accessToken });
  };
}
