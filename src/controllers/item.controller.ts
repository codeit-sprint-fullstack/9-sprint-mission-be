import type { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../common/constants/index";
import { ItemService } from "../services/item.service";
import { BaseController } from "./base.controller";

export class ItemController extends BaseController {
  constructor(private readonly itemService: ItemService) {
    super();
  }

  /** 아이템 목록을  가져옵니다. */
  getItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const keyword = req.query.keyword as string | undefined
      const orderBy = (req.query.orderBy as "recent" | "oldest") || "recent"

      const { items, total, totalPage } = await this.itemService.getItems({
        page: page,
        limit: limit,
        keyword,
        orderBy,
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

  /** 아이템 상세 */
  getItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { itemId } = req.params;
      const item = await this.itemService.getItemById(itemId);

      return this.sendSuccess(res, item, "아이템을 찾았습니다.");
    } catch (error) {
      this.nextError(next, error);
    }
  };

  /** 아이템 생성 */
  createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = this.getUserId(req);
      const { name, description, price, tags } = req.body;
      const images = req.files as Express.Multer.File[];

      const newItem = await this.itemService.createItem({
        name,
        description,
        price,
        tags,
        images,
        authorId,
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

  /** 상품 업데이트 */
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

  /** 아이템 삭제 */
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

  /** 댓글 생성 */
  createComment = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const {itemId} = req.params ;
      const {context} = req.body;
      const userId = this.getUserId(req)

      const newComment = await this.itemService.addComment(itemId, userId, context)

      return this.sendSuccess(res,newComment,"댓글이 등록되었습니다.",201)
    } catch (error) {
      this.nextError(next,error) 
    }
  }

  /** 댓글 삭제 */
  deleteComment = async(req:Request,res:Response,next:NextFunction) => {
    try {
      const { commentId } = req.params
      const userId = this.getUserId(req) 

      await this.itemService.deleteComment(commentId, userId)

      return this.sendSuccess(res,null,"댓글이 성공적으로 삭제되었습니다.")
    } catch (error) {
      this.nextError(next,error) 
    }
  }
}
