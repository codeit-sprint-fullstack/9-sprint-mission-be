import { HttpStatus } from "../common/constants/index.js";

export class ArticleController {
  constructor(articleService) {
    this.articleService = articleService;
  }

  getArticles = async (req, res, next) => {
    try {
      const { page, limit, keyword, orderBy } = req.query;

      const { articles, total, totalPage } =
        await this.articleService.getArticles({
          page: parseInt(page),
          limit: parseInt(limit),
          keyword,
          orderBy,
        });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "성공적으로 게시물을 가져왔습니다.",
        data: articles,
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

  getBestArticles = async (req, res, next) => {
    try {
      const bestArticles = await this.articleService.getBestArticles();

      res.status(HttpStatus.OK).json({
        success: true,
        message: "베스트 게시물 가져오기를 성공하였습니다.",
        data: bestArticles,
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  getArticleById = async (req, res, next) => {
    try {
      const { articleId } = req.params;
      const article = await this.articleService.getArticleById(articleId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "성공적으로 게시물을 가져왔습니다.",
        data: article,
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  createArticle = async (req, res, next) => {
    try {
      const { title, content, images } = req.body;

      const newArticle = await this.articleService.createArticle({
        title,
        content,
        images,
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "게시물 생성에 성공했습니다.",
        data: newArticle,
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  updateArticle = async (req, res, next) => {
    try {
      const { articleId } = req.params;
      const data = req.body;

      const updateArticle = await this.articleService.patchArticle(
        articleId,
        data
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "게시물 업데이트에 성공했습니다.",
        data: updateArticle,
      });
    } catch (error) {
      next(error);
      return;
    }
  };

  deleteArticle = async (req, res, next) => {
    try {
      const { articleId } = req.params;

      await articleService.deleteArticle(articleId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "게시물 삭제에 성공했습니다.",
      });
    } catch (error) {
      next(error);
      return;
    }
  };
}
