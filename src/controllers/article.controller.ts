import type { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../common/constants/index.js";
import { ArticleService } from "../services/article.service.js";
import { BaseController } from "./base.controller.js";

export class ArticleController extends BaseController {
  constructor(private readonly articleService: ArticleService) {
    super();
  }

  /** 전체 게시물 목록 조회 */
  getArticles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { keyword, orderBy } = req.query;

      const { articles, total, totalPage } =
        await this.articleService.getArticles({
          page: page,
          limit: limit,
          keyword: keyword as string,
          orderBy: orderBy as string,
        });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "성공적으로 게시물을 가져왔습니다.",
        data: articles,
        pagination: { page, limit, total, totalPage },
      });
    } catch (error) {
      this.nextError(next, error);
    }
  };

  /** 베스트 게시글 조회 */
  getBestArticles = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const bestArticles = await this.articleService.getBestArticles();

      return this.sendSuccess(res,bestArticles,"베스트 게시물 가져오기를 성공하였습니다.");
    } catch (error) {
      this.nextError(next, error);
    }
  };

  /** 특정 ID로 게시글 상세 조회 */
  getArticleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { articleId } = req.params;
      const article = await this.articleService.getArticleById(articleId);

      return this.sendSuccess(res, article, "게시물을 가져왔습니다.");
    } catch (error) {
      this.nextError(next, error);
    }
  };

  /** 새 게시물 작성 */
  createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, content, images } = req.body;
      const userId = this.getUserId(req)

      const newArticle = await this.articleService.createArticle({
        title,
        content,
        images,
        userId
      });

      return this.sendSuccess(res,newArticle,"게시물 생성에 성공했습니다.",201);
    } catch (error) {
      this.nextError(next, error);
    }
  };

  /** 게시글 수정 */
  updateArticle = async (req:Request, res:Response, next:NextFunction) => {
    try {
      const { articleId } = req.params;
      const data = req.body;
      const userId = this.getUserId(req)

      const updatedArticle = await this.articleService.updateArticle(articleId,data,userId);

      return this.sendSuccess(res,updatedArticle,"게시물 업데이트에 성공했습니다.");
    } catch (error) {
      this.nextError(next, error);
    }
  };

  /** 게시글 삭제 */
  deleteArticle = async (req:Request, res:Response, next:NextFunction) => {
    try {
      const { articleId } = req.params;
      const userId = this.getUserId(req);

      await this.articleService.deleteArticle(articleId,userId);

      return this.sendSuccess(res,null,"게시물 삭제에 성공했습니다.");
    } catch (error) {
      this.nextError(next, error)
    }
  };
}
