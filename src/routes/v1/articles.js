import express from "express";
import { HttpStatus } from "../../common/constants/index.js";
import { articleService } from "../../services/article.service.js";

export const articleRouter = express.Router();

articleRouter.get("/", async (req, res, next) => {
  try {
    const { page, limit, keyword, orderBy } = req.query;

    const { articles, total, totalPage } = await articleService.getArticles({
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
});

articleRouter.get("/:articleId", async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const article = await articleService.getArticleById(articleId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "성공적으로 게시물을 가져왔습니다.",
      data: article,
    });
  } catch (error) {
    next(error);
    return;
  }
});

articleRouter.post("/", async (req, res, next) => {
  try {
    const { title, content, images } = req.body;

    const newArticle = await articleService.createArticle({
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
});

articleRouter.patch("/:articleId", async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const data = req.body;

    const updateArticle = await articleService.patchArticle(articleId, data);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "게시물 업데이트에 성공했습니다.",
      data: updateArticle,
    });
  } catch (error) {
    next(error);
    return;
  }
});

articleRouter.delete("/:articleId", async (req, res, next) => {
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
});
