import express from "express";
// import { itemRouter } from "./items";

export const router = express.router();

router.get("/", (req, res) => {
  res.json({
    message: "Hello Panda!",
    timestamp: new Date().toISOString(),
  });
});

// router.use("/items", itemRouter);
