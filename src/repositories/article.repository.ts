import { prisma } from "../db/prisma";
import type { PrismaClient, Prisma } from "../generated/client";

 type OrderByType = "recent" | "favorite"

export class ArticleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /** 아티클 목록 조회 */
  async findAll({
    skip,
    take,
    orderBy,
    keyword,
  }: {
    skip?: number;
    take?: number;
    orderBy: OrderByType;
    keyword?: string;
  }) {
    const sortOptions: Prisma.ArticleOrderByWithRelationInput = {
      recent: { createdAt: "desc"  as Prisma.SortOrder},
      // 추후 favorite orderBy
      favorite: { createdAt: "desc"  as Prisma.SortOrder},
    }[orderBy ?? "recent"] ?? { createdAt: "desc" };

    const where:Prisma.ArticleWhereInput = keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: "insensitive" as Prisma.QueryMode } },
            { content: { contains: keyword, mode: "insensitive" as Prisma.QueryMode} },
          ],
        }
      : {};

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        orderBy: sortOptions,
        skip,
        take,
        include: {
          author: {
            include: {
              userProfile: true,
            },
          },
        },
      }),
      this.prisma.article.count({ where }),
    ]);
    return { articles, total };
  }

  /** 베스트 아티클 목록 조회 */
  async findBestAll() {
    const bestArticles = await this.prisma.article.findMany({
      orderBy: {
        view: "desc",
      },
      take: 3,
      include: {
        author: {
          include: {
            userProfile: true,
          },
        },
      },
    });
    return bestArticles;
  }

  async findById(articleId: string) {
    return await this.prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: {
          include: {
            userProfile: true,
          },
        },
        review: {
          include: {
            author: {
              include: {
                userProfile: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: Prisma.ArticleCreateInput) {
    return await this.prisma.article.create({ data });
  }

  async update(articleId:string, data:Prisma.ArticleUpdateInput) {
    return await this.prisma.article.update({
      where: { id: articleId },
      data,
    });
  }

  async delete(articleId:string) {
    return await this.prisma.article.delete({
      where: { id: articleId },
    });
  }
}

export const articleRepository = new ArticleRepository(prisma);
