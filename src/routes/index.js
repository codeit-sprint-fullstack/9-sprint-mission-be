import express from "express";
import { itemRouter } from "./v1/items.js";
import { articleRouter } from "./v1/articles.js";

export const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Hello Panda!",
    timestamp: new Date().toISOString(),
  });
});

router.use("/api/v1/items", itemRouter);
router.use("/api/v1/articles", articleRouter);
