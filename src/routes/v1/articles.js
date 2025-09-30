import express from "express";
import { prisma } from "../../db/index.js";
import { NotFoundException } from "../../common/exceptions/index.js";

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

    let sortOptions = {};
    if (orderBy === "recent") {
      sortOptions = { createdAt: "desc" };
    }
    if (orderBy === "oldest") {
      sortOptions = { createdAt: "asc" };
    }

    const article = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      },
      orderBy: sortOptions,
      skip: limit * (page - 1),
      take: limit,
    });

    res.status(200).json({
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
    });

    if (!article) {
      throw new NotFoundException("해당게시물을 찾을수없습니다.");
    }

    res.status(200).json({
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

    res.status(201).json({
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
      throw new NotFoundException("수정에 실패하였습니다.");
    }

    res.status(200).json({
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
      throw new NotFoundException("게시물을 찾을 수 없습니다.");
    }

    res.status(200).json({
      success: true,
      message: "success delete article",
      data: deleteArticle,
    });
  } catch (error) {
    if (error.code === "P2025") {
      next(new NotFoundException("Failed delete article"));
    } else {
      next(error);
    }
    return;
  }
});
