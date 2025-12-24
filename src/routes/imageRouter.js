import express from "express";
import upload from "../middlewares/upload.js";

const imageRouter = express.Router();

imageRouter.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "이미지가 없습니다." });
  }

  const url = `/img/${req.file.filename}`;
  res.status(200).json({ url });
});

export default imageRouter;
