import express from "express";
import type { Router } from "express";
import { articleController } from "../../controllers/index.js";
import { auth } from "../../middlewares/auth.js";

export const articleRouter: Router = express.Router();

articleRouter.get("/", articleController.getArticles);
articleRouter.get("/best", articleController.getBestArticles);

articleRouter.get("/:articleId", articleController.getArticleById);

articleRouter.post(
  "/",
  auth.verifyAccessToken,
  articleController.createArticle
);

articleRouter.patch(
  "/:articleId",
  auth.verifyAccessToken,
  articleController.updateArticle
);

articleRouter.delete(
  "/:articleId",
  auth.verifyAccessToken,
  articleController.deleteArticle
);
