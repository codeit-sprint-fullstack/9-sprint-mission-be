import express from "express";
import { userController } from "../../controllers/index.js";

export const userRouter = express.Router();

userRouter.get("/me", userController.getMe);
