import { HttpStatus } from "../common/constants/index.js";

export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  signUp = async (req, res, next) => {
    try {
      const { email, nickname, password } = req.body;

      const user = await this.userService.createUser({
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
      const user = await this.userService.getUser({
        email,
        password,
      });

      const accessToken = this.userService.createToken(user);
      const refreshToken = this.userService.createToken(user, "refresh");
      await this.userService.updateUser(user.id, { refreshToken });
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
        await this.userService.refreshToken(userId, refreshToken);

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

  googleCallback = async (req, res, next) => {
    const accessToken = this.userService.createToken(req.user);
    const refreshToken = this.userService.createToken(req.user, "refresh");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.json({ accessToken });
  };
}
