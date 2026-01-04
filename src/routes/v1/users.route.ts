import express from "express";
import type { Router } from "express";
import { userController } from "../../controllers/index";
import { auth } from "../../middlewares/auth";

export const userRouter: Router = express.Router();

userRouter.get("/me", auth.verifyAccessToken, userController.getMe);
