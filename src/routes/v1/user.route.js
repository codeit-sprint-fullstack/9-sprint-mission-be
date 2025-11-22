import express from "express";
import { userController } from "../../controllers/index.js";

export const userRouter = express.Router();

userRouter.post("/signUp", userController.signUp);

userRouter.post("/signIn", userController.signIn);
