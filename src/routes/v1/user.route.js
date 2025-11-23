import express from "express";
import { userController } from "../../controllers/index.js";
import { auth } from "../../middlewares/auth.js";

export const userRouter = express.Router();

userRouter.post("/signUp", userController.signUp);

userRouter.post("/signIn", userController.signIn);

userRouter.post(
  "/refresh-token",
  auth.requireRefreshToken,
  userController.refreshToken
);

userRouter.get(
  "/google/callback",
  auth.requireGoogleStrategy,
  userController.googleCallback
);

userRouter.get("/google", auth.requireGoogleScope);
