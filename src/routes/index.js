import express from "express";
import { itemRouter } from "./v1/items.route.js";
import { articleRouter } from "./v1/articles.route.js";
import { userRouter } from "./v1/user.route.js";

export const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Hello Panda!",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", userRouter);
router.use("/items", itemRouter);
router.use("/articles", articleRouter);
