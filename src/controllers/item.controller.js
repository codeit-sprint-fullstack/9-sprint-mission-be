import { HttpStatus } from "../common/constants/index.js";

export class ItemController {
  constructor(itemService) {
    this.itemService = itemService;
  }

  getItem = async (req, res, next) => {
    try {
      const { page, limit, keyword, orderBy } = req.query;

      const { items, total, totalPage } = await this.itemService.getItems({
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
  };

  getItemById = async (req, res, next) => {
    try {
      const { itemId } = req.params;
      const item = await this.itemService.getItemById(itemId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "아이템을 찾았습니다.",
        data: item,
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  createItem = async (req, res, next) => {
    try {
      const { name, description, price, tags } = req.body;

      const newItem = await this.itemService.createItem({
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
  };

  updateItem = async (req, res, next) => {
    try {
      const { itemId } = req.params;
      const data = req.body;

      const updateItem = await this.itemService.updateItem(itemId, data);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "아이템 업데이트를 성공하였습니다.",
        data: updateItem,
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  deleteItem = async (req, res, next) => {
    try {
      const { itemId } = req.params;

      await this.itemService.deleteItem(itemId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "아이템 삭제를 성공하였습니다.",
      });
    } catch (error) {
      next(error);
      return;
    }
  };
}
