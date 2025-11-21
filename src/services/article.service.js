import { prisma } from "../db/prisma.js";
import { NotFoundException } from "../common/exceptions/index.js";
import { NOT_FOUND_ARTICLE } from "../common/constants/index.js";

export class ArticleService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async getArticles({ page, limit, keyword, orderBy }) {
    const skip = (page - 1) * limit;

    const sortOptions = {
      recent: { createdAt: "desc" },
      favorite: { likeCount: "desc" },
    }[orderBy] ?? { createdAt: "desc" };

    const where = {
      OR: [
        { name: { contain: keyword, mode: "insensitive" } },
        { description: { contain: keyword, mode: "insensitive" } },
      ],
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: sortOptions,
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return {
      articles,
      total,
      totalPage: Math.ceil(total / limit),
    };
  }

  async getArticleById(articleId) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
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

    return article;
  }

  async createArticle(data) {
    return await this.prisma.article.create({ data });
  }

  async patchArticle(articleId, data) {
    try {
      const updatedArticle = await this.prisma.article.update({
        where: { id: articleId },
        data,
      });
      return updatedArticle;
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(NOT_FOUND_ARTICLE);
      }
      throw error;
    }
  }

  async deleteArticle(articleId) {
    const deletedArticle = await this.prisma.article.delete({
      where: { id: articleId },
    });

    if (!deletedArticle) {
      throw new NotFoundException(NOT_FOUND_ARTICLE);
    }
    return deletedArticle;
  }
}

export const articleService = new ArticleService(prisma);
