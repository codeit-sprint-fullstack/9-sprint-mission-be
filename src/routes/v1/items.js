import express from "express";

import { validateBody } from "../../middlewares/validate.js";
import { createItemSchema, updateItemSchema } from "../../dto/item.dto.js";
import { itemService } from "../../services/item.service.js";

export const itemRouter = express.Router();

itemRouter.get("/", async (req, res, next) => {
  try {
    const { page, limit, keyword, orderBy } = req.query;

    const { items, total, totalPage } = await itemService.getItems({
      page: parseInt(page),
      limit: parseInt(limit),
      keyword,
      orderBy,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPage,
      },
    });
  } catch (error) {
    next(error);
    return;
  }
});

itemRouter.get("/:productId", async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await itemService.getItemById(itemId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "아이템을 찾았습니다.",
      data: item,
    });
  } catch (error) {
    next(error);
    return;
  }
});

itemRouter.post("/", validateBody(createItemSchema), async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;

    const newItem = await itemService.createItem({
      name,
      description,
      price,
      tags,
    });
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "아이템을 생성하였습니다.",
      data: newItem,
    });
  } catch (error) {
    next(error);
    return;
  }
});

itemRouter.patch(
  "/:productId",
  validateBody(updateItemSchema),
  async (req, res, next) => {
    try {
      const { itemId } = req.params;
      const data = req.body;

      const updateItem = await itemService.updateItem(itemId, data);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "아이템 업데이트를 성공하였습니다.",
        data: updateItem,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
);

itemRouter.delete("/:productId", async (req, res, next) => {
  try {
    const { itemId } = req.params;

    await itemService.deleteItem(itemId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "아이템 삭제를 성공하였습니다.",
    });
  } catch (error) {
    next(error);
    return;
  }
});
