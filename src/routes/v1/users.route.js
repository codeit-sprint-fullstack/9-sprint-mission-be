import express from "express";
import { userController } from "../../controllers/index.js";
import { auth } from "../../middlewares/auth.js";

export const userRouter = express.Router();

userRouter.get("/me", auth.verifyAccessToken, userController.getMe);
