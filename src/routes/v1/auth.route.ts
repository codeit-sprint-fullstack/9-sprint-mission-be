import express from "express";
import type { Router } from "express";
import { authController } from "../../controllers/index";
import { auth } from "../../middlewares/auth";

export const authRouter: Router = express.Router();

authRouter.post("/signUp", auth.alreadyAuthenticated, authController.signUp);
authRouter.post("/signIn", auth.alreadyAuthenticated, authController.signIn);
authRouter.post("/signOut", auth.verifyAccessToken, authController.signOut);

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
