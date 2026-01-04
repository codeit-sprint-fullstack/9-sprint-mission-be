import express from "express";
import type { Request, Response, Router } from "express";
import { itemRouter } from "./v1/items.route";
import { articleRouter } from "./v1/articles.route";
import { authRouter } from "./v1/auth.route";
import { userRouter } from "./v1/users.route";

export const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello Panda!",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use("/articles", articleRouter);
