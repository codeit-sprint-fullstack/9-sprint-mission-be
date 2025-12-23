import type { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../common/constants/index";
import { ItemService } from "../services/item.service";
import { BaseController } from "./base.controller";
import { UnAuthorizedException } from "../common/exceptions/error";

export class ItemController extends BaseController {
  constructor(private readonly itemService: ItemService) {
    super();
  }

  getItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { keyword, orderBy } = req.query;

      const { items, total, totalPage } = await this.itemService.getItems({
        page: page,
        limit: limit,
        keyword: keyword as string,
        orderBy: orderBy as string,
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        data: items,
        pagination: { page, limit, total, totalPage },
      });
    } catch (error) {
      this.nextError(next, error);
    }
  };

  getItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { itemId } = req.params;
      const item = await this.itemService.getItemById(itemId);

      return this.sendSuccess(res, item, "아이템을 찾았습니다.");
    } catch (error) {
      this.nextError(next, error);
    }
  };

  createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = this.getUserId(req);
      const { name, description, price, tags } = req.body;
      const images = req.files as Express.Multer.File[];

      const newItem = await this.itemService.createItem({
        name,
        description,
        price,
        tags,
        images,
        userId,
      });

      return this.sendSuccess(
        res,
        newItem,
        "아이템을 생성하였습니다.",
        HttpStatus.CREATED
      );
    } catch (error) {
      this.nextError(next, error);
    }
  };

  updateItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { itemId } = req.params;
      const data = req.body;

      const updateItem = await this.itemService.updateItem(itemId, data);

      return this.sendSuccess(
        res,
        updateItem,
        "아이템 업데이트를 성공하였습니다."
      );
    } catch (error) {
      this.nextError(next, error);
    }
  };

  deleteItem = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.getUserId(req);
    const { itemId } = req.params;

    try {
      await this.itemService.deleteItem(itemId, userId);

      return this.sendSuccess(res, null, "아이템 삭제를 성공하였습니다.");
    } catch (error) {
      this.nextError(next, error);
    }
  };
}
