import express from "express";

import { validateBody } from "../../middlewares/validate.js";
import { createItemSchema, updateItemSchema } from "../../dto/item.dto.js";
import { itemController } from "../../controllers/index.js";

export const itemRouter = express.Router();

itemRouter.get("/", itemController.getItem);

itemRouter.get("/:itemId", itemController.getItemById);

itemRouter.post("/", validateBody(createItemSchema), itemController.createItem);

itemRouter.patch(
  "/:itemId",
  validateBody(updateItemSchema),
  itemController.updateItem
);

itemRouter.delete("/:itemId", itemController.deleteItem);
