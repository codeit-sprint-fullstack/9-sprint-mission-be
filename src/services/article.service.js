import { NotFoundException } from "../common/exceptions/index.js";
import { NOT_FOUND_ARTICLE } from "../common/constants/index.js";
import { articleRepository } from "../repositories/article.repository.js";

export class ArticleService {
  constructor(articleRepository) {
    this.articleRepository = articleRepository;
  }

  async getArticles({ page, limit, keyword, orderBy }) {
    const skip = (page - 1) * limit;

    const { articles, total } = await this.articleRepository.findAll({
      skip,
      take: limit,
      orderBy,
      keyword,
    });

    return {
      articles,
      total,
      totalPage: Math.ceil(total / limit),
    };
  }

  async getBestArticles() {
    const bestArticles = await this.articleRepository.findBestAll();
    if (!bestArticles) {
      throw new NotFoundException(NOT_FOUND_ARTICLE);
    }
    return bestArticles;
  }

  async getArticleById(articleId) {
    const article = await this.articleRepository.findById(articleId);

    if (!article) {
      throw new NotFoundException(NOT_FOUND_ARTICLE);
    }

    return article;
  }

  async createArticle(data,userId) {
    return await this.articleRepository.create(data);
  }

  async updateArticle(articleId, data,userId) {
    try {
      return await this.articleRepository.update(articleId, data);
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(NOT_FOUND_ARTICLE);
      }
      throw error;
    }
  }

  async deleteArticle(articleId,userId) {
    try {
      return await this.articleRepository.delete(articleId);
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(NOT_FOUND_ARTICLE);
      }
      throw error;
    }
  }
}

export const articleService = new ArticleService(articleRepository);
