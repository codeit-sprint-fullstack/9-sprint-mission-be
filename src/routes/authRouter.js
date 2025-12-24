import express from "express";
import authService from "../services/authService.js";
import auth from "../middlewares/authHandler.js";

const authRouter = express.Router();

authRouter.post("/signUp", async (req, res, next) => {
  try {
    const { email, nickname, password } = req.body;
    if (!email || !nickname || !password) {
      const error = new Error("email, nickname, password 가 모두 필요합니다.");
      error.code = 400;
      throw error;
    }
    const user = await authService.createUser({
      email,
      nickName: nickname,
      password,
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/signIn", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      const error = new Error("email, password 가 모두 필요합니다.");
      error.code = 400;
      throw error;
    }
    const user = await authService.getUser(email, password);

    const accessToken = authService.createToken(user);
    const refreshToken = authService.createToken(user, "refresh");
    await authService.updateUser(user.id, { refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.json({ ...user, accessToken });
  } catch (error) {
    next(error);
  }
});

authRouter.post(
  "/refresh-token",
  auth.verifyRefreshToken,
  async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const { userId } = req.auth;
      // TODO: 새로 발급받은 refreshToken 을 쿠키에 저장하세요
      // httpOnly, sameSite, secure 속성 설정하세요
      // path 는 api URI 경로에서만 쿠키전송되도록 /token/refresh 경로로 설정
      const accessToken = await authService.refreshToken(userId, refreshToken);
      return res.json({ accessToken });
    } catch (error) {
      return next(error);
    }
  }
);

export default authRouter;
