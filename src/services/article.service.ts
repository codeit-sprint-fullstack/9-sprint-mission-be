import { NotFoundException, UnAuthorizedException } from "../common/exceptions/error";
import { NOT_FOUND_ARTICLE } from "../common/constants/index";
import {
  ArticleRepository,
  articleRepository,
} from "../repositories/article.repository";
import { Prisma } from "../generated/client";

type OrderByType = "recent" | "favorite";

export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  /** 게시글 목록 가져오기 */
  async getArticles({
    page,
    limit,
    keyword,
    orderBy,
  }: {
    page: number;
    limit: number;
    keyword?: string;
    orderBy: OrderByType;
  }) {
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

  /** 베스트 게시글 목록 */
  async getBestArticles() {
    const bestArticles = await this.articleRepository.findBestAll();

    if (!bestArticles) {
      throw new NotFoundException(NOT_FOUND_ARTICLE);
    }

    return bestArticles;
  }

  /** 게시글 상세 */
  async getArticleById(articleId: string) {
    const article = await this.articleRepository.findById(articleId);

    if (!article) {
      throw new NotFoundException(NOT_FOUND_ARTICLE);
    }

    return article;
  }

  /** 게시글 생성 */
  async createArticle(userId: string, data: {title:string, content: string, image?:string}) {
    return await this.articleRepository.create({
      ...data,
      author: {
        connect: { id: userId}
      }
    });
  }

  /** 게시글 업데이트 */
  async updateArticle(
    articleId: string,
    userId: string,
    data: Prisma.ArticleUpdateInput
  ) {
    // 수정권한 확인
    const article = await this.getArticleById(articleId)
    if (article.authorId !== userId) {
      throw new UnAuthorizedException("수정 권한이 없습니다")
    }

    try {
      return await this.articleRepository.update(articleId, data);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(NOT_FOUND_ARTICLE);
        }
      }
      throw error;
    }
  }

  /** 게시글 삭제 */
  async deleteArticle(articleId: string, userId: string) {
    const article = await  this.getArticleById(articleId);
    if (article.authorId !== userId) {
      throw new UnAuthorizedException("삭제 권한이 없습니다")
    }

    try {
      return await this.articleRepository.delete(articleId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(NOT_FOUND_ARTICLE);
        }
      }
      throw error;
    }
  }
}

export const articleService = new ArticleService(articleRepository);
