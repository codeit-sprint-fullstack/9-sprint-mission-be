import express from "express";

import { validateBody } from "../../middlewares/validate.js";
import { createItemSchema, updateItemSchema } from "../../dto/item.dto.js";
import { itemController } from "../../controllers/index.js";
import { auth } from "../../middlewares/auth.js";
import { upload } from "../../middlewares/multer.js";

export const itemRouter = express.Router();

const assignImageUrlToBody = (req, res, next) => {
  if (req.files && req.files.length > 0) {
    const imageUrl = req.files.map((file) => `/uploads/${file.filename}`);
    req.body.images = imageUrl;
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

//likes
itemRouter.get(
  "/:itemId/likes",
  auth.verifyAccessToken,
  itemController.getLikesStatus
);

itemRouter.post(
  "/:itemId/likes",
  auth.verifyAccessToken,
  itemController.toggleItemLike
);
