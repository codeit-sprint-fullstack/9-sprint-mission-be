import express from "express";
import { authController } from "../../controllers/index.js";
import { auth } from "../../middlewares/auth.js";

export const authRouter = express.Router();

authRouter.post("/signUp", authController.signUp);

authRouter.post("/signIn", authController.signIn);

authRouter.post(
  "/refresh-token",
  auth.requireRefreshToken,
  authController.refreshToken
);

authRouter.get(
  "/google/callback",
  auth.requireGoogleStrategy,
  authController.googleCallback
);

authRouter.get("/google", auth.requireGoogleScope);
