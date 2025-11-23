import express from "express";
import { upload } from "../../middlewares/multer.js";
import { HttpStatus } from "../../common/constants/index.js";
import { BadRequestException } from "../../common/exceptions/badRequestException.js";

export const imageRouter = express.Router();
// route + controller
// const upload = multer({ dest: "uploads"})
imageRouter.post("/upload", upload.single("image"), (req, res, next) => {
  try {
    if (!req.file) {
      throw new BadRequestException("파일이 업로드되지 않았습니다.");
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "이미지 업로드 성공",
      data: {
        url: imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
});
