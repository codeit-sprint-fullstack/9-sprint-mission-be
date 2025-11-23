import express from "express";
import { articleController } from "../../controllers/index.js";

export const articleRouter = express.Router();

articleRouter.get("/", articleController.getArticles);
articleRouter.get("/best", articleController.getBestArticles);

articleRouter.get("/:articleId", articleController.getArticleById);

articleRouter.post("/", articleController.createArticle);

articleRouter.patch("/:articleId", articleController.updateArticle);

articleRouter.delete("/:articleId", articleController.deleteArticle);
