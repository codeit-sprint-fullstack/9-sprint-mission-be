import express from "express";
import { itemRouter } from "./items.js";

export const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Hello Panda!",
    timestamp: new Date().toISOString(),
  });
});

router.use("/api/items", itemRouter);
