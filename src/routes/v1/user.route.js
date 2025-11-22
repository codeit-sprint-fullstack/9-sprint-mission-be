import express from "express";
import { userController } from "../../controllers/index.js";
import { requireRefreshToken } from "../../middlewares/auth.js";

export const userRouter = express.Router();

userRouter.post("/signUp", userController.signUp);

userRouter.post("/signIn", userController.signIn);

userRouter.post(
  "/refresh-token",
  requireRefreshToken,
  userController.refreshToken
);
