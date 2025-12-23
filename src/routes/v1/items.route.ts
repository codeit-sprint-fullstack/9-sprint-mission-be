import express from "express";
import type { NextFunction, Request, Response, Router } from "express";

import { validateBody } from "../../middlewares/validate.js";
import { createItemSchema, updateItemSchema } from "../../dto/item.dto.js";
import { itemController } from "../../controllers/index.js";
import { auth } from "../../middlewares/auth.js";
import { upload } from "../../middlewares/multer.js";

export const itemRouter: Router = express.Router();

/** 업로드된 파일 정보(multer)를 body의 images필드로 변환하는 미들웨어 */
const assignImageUrlToBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.files && Array.isArray(req.files)) {
    if (req.files.length > 0) {
      const imageUrl = (req.files as Express.Multer.File[]).map(
        (file) => `/uploads/${file.filename}`
      );
      req.body.images = imageUrl;
    }
  }
  next();
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
  upload.array("images"),
  assignImageUrlToBody,
  validateBody(updateItemSchema),
  itemController.updateItem
);

itemRouter.delete(
  "/:itemId",
  auth.verifyAccessToken,
  itemController.deleteItem
);
