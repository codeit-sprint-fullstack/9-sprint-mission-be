import express from "express";
import { prisma } from "../../db/index.js";
import { NotFoundException } from "../../common/exceptions/index.js";
import { HttpStatus } from "../../common/constants/httpStatus.js";
import {
  FAILED_DELETE_ARTICLE,
  FAILED_UPDATE_ARTICLE,
  FAILED_UPDATE_ARTICLE_VIEW,
  NOT_FOUND_ARTICLE,
} from "../../common/constants/errorMessage.js";
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticles,
  patchArticle,
  patchArticleForView,
} from "../../controllers/v1/article.controller.js";

export const articleRouter = express.Router();

articleRouter.get("/", getArticles);

articleRouter.get("/:articleId", getArticleById);

articleRouter.post("/", createArticle);

articleRouter.patch("/:articleId", patchArticle);

articleRouter.patch("/:articleId/views", patchArticleForView);

articleRouter.delete("/:articleId", deleteArticle);
