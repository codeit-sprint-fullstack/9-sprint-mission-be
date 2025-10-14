import express from "express";
import { validateProduct } from "../../middlewares/validateProduct.js";
import { validateQuery } from "../../middlewares/validate.js";
import { getItemsSchema } from "../../controllers/v1/dto/Items.js";
import {
  createItem,
  deleteItem,
  getItemById,
  getItems,
  patchItem,
} from "../../controllers/v1/item.controller.js";

export const itemRouter = express.Router();

itemRouter.get("/", validateQuery(getItemsSchema), getItems);

itemRouter.get("/:productId", getItemById);

itemRouter.post("/", validateProduct, createItem);

itemRouter.delete("/:productId", deleteItem);

itemRouter.patch("/:productId", validateProduct, patchItem);
