import { prisma } from "../db/prisma.js";

export class ArticleRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async findAll({ skip, take, orderBy, keyword }) {
    const sortOptions = {
      recent: { createdAt: "desc" },
      // 추후 favorite orderBy
      favorite: { createdAt: "desc" },
    }[orderBy] ?? { createdAt: "desc" };

    const where = keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: "insensitive" } },
            { content: { contains: keyword, mode: "insensitive" } },
          ],
        }
      : {};

    const [article, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        orderBy: sortOptions,
        skip,
        take,
      }),
      this.prisma.article.count({ where }),
    ]);
    return { article, total };
  }

  async findById(articleId) {
    return await this.prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: {
          include: {
            userProfile: true,
          },
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
    });
  }

  async create(data) {
    return await this.prisma.article.create({ data });
  }

  async update(articleId, data) {
    return await this.prisma.article.update({
      where: { id: articleId },
      data,
    });
  }

  async delete(articleId) {
    return await this.prisma.article.delete({
      where: { id: articleId },
    });
  }
}

export const articleRepository = new ArticleRepository(prisma);
