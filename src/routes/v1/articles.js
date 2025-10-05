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

export const articleRouter = express.Router();

articleRouter.get("/", async (req, res, next) => {
  try {
    const {
      page: pageStr = 1,
      limit: limitStr = 10,
      keyword = "",
      orderBy = "recent",
    } = req.query;

    const page = parseInt(pageStr);
    const limit = parseInt(limitStr);
    const total = await prisma.article.count();
    const totalPage = Math.ceil(total / limit);

    const SORT_MAP = {
      recent: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
    };

    const sortOptions = SORT_MAP[orderBy] ?? {};

    const article = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      },
      include: {
        author: {
          include: {
            userProfile: true,
          },
        },
      },
      orderBy: sortOptions,
      skip: limit * (page - 1),
      take: limit,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: "success get articls",
      data: article,
      pagination: {
        page,
        limit,
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
    const article = await prisma.article.findUnique({
      where: { id: parseInt(articleId) },
      include: {
        Comment: {
          include: {
            author: {
              include: {
                userProfile: true,
              },
            },
          },
        },
        author: {
          include: {
            userProfile: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException(NOT_FOUND_ARTICLE);
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "success get article",
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

    // TODO: userId
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        images,
      },
    });

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "success create article",
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
    const { title, content, images } = req.body;

    const updateArticle = await prisma.article.update({
      where: { id: parseInt(articleId) },
      data: {
        title,
        content,
        images,
      },
    });

    if (!updateArticle) {
      throw new NotFoundException(FAILED_UPDATE_ARTICLE);
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "success update article",
      data: updateArticle,
    });
  } catch (error) {
    next(error);
    return;
  }
});

articleRouter.patch("/:articleId/views", async (req, res, next) => {
  try {
    const { articleId } = req.params;

    const updateArticle = await prisma.article.update({
      where: { id: parseInt(articleId) },
      data: {
        view: {
          increment: 1,
        },
      },
    });

    if (!updateArticle) {
      throw new NotFoundException(FAILED_UPDATE_ARTICLE_VIEW);
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "success update article",
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
    const deleteArticle = await prisma.article.delete({
      where: { id: parseInt(articleId) },
    });

    if (!deleteArticle) {
      throw new NotFoundException(NOT_FOUND_ARTICLE);
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "success delete article",
      data: deleteArticle,
    });
  } catch (error) {
    if (error.code === "P2025") {
      next(new NotFoundException(FAILED_DELETE_ARTICLE));
    } else {
      next(error);
    }
    return;
  }
});
