import express from "express";

import { validateBody } from "../../middlewares/validate.js";
import { createItemSchema, updateItemSchema } from "../../dto/item.dto.js";
import { itemController } from "../../controllers/index.js";
import { auth } from "../../middlewares/auth.js";
import { upload } from "../../middlewares/multer.js";

export const itemRouter = express.Router();

const assignImageUrlToBody = (req, res, next) => {
  // multer의 upload.array("images") 실행 후 req.files에 파일 정보가 담깁니다.
  if (req.files && req.files.length > 0) {
    // 임시 URL 생성 (실제 환경에서는 S3 URL 등으로 대체되어야 합니다)
    // 현재는 단일 이미지를 가정하여 첫 번째 파일의 경로를 사용합니다.
    const imageUrl = req.files.map((file) => `/uploads/${file.filename}`);

    // Zod 스키마가 기대하는 req.body.image 필드에 URL 문자열 할당
    req.body.images = imageUrl;

    // 참고: 백엔드 스키마의 tags는 이미 배열로 넘어오므로 별도 처리 불필요
  }
  next(); // 다음 미들웨어(Zod 검증)로 이동
};

itemRouter.get("/", itemController.getItem);

itemRouter.get("/:itemId", itemController.getItemById);

itemRouter.post(
  "/",
  auth.verifyAccessToken,
  upload.array("images"),
  assignImageUrlToBody,
  validateBody(createItemSchema),
  itemController.createItem
);

itemRouter.patch(
  "/:itemId",
  auth.verifyAccessToken,
  validateBody(updateItemSchema),
  itemController.updateItem
);

itemRouter.delete(
  "/:itemId",
  auth.verifyAccessToken,
  itemController.deleteItem
);
