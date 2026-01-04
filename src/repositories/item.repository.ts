import { prisma } from "../db/prisma";
import type { PrismaClient, Prisma } from "../generated/client";
import { OrderByType } from "../types/item";

export class ItemRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /** 상품 목록 조회 (검색, 페이지, 정렬) */
  async findAll({
    skip,
    take,
    orderBy,
    keyword,
  }: {
    skip?: number;
    take?: number;
    orderBy?: OrderByType;
    keyword?: string;
  }) {
    // LUT 정렬 로직
    const sortOptions: Prisma.ItemOrderByWithRelationInput = {
      recent: { createdAt: "desc" as Prisma.SortOrder },
      oldest: { createdAt: "asc" as Prisma.SortOrder },
    }[orderBy ?? "recent"] ?? { createdAt: "desc" };
    // 검색  조건
    const where: Prisma.ItemWhereInput = keyword
      ? {
          OR: [
            {
              name: {
                contains: keyword,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              description: {
                contains: keyword,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          ],
        }
      : {};
    // 병렬 처리
    const [items, total] = await Promise.all([
      this.prisma.item.findMany({
        where,
        orderBy: sortOptions,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              userProfile: true,
            },
          },
          _count: {
            select: {
              itemLikes: true,
            },
          },
        },
      }),
      this.prisma.item.count({ where }),
    ]);
    return { items, total };
  }

  /** 상품 상세 조회 */
  async findById(itemId: string) {
    return await this.prisma.item.findUnique({
      where: { id: itemId },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            userProfile: true,
          },
        },
        itemComments: {
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                userProfile: {
                  select: {
                    photoUrl: true,
                  },
                },
              },
            },
          },
        },
        tags: true,
        _count: {
          select: { itemLikes: true },
        },
      },
    });
  }

  /** 상풍 생성 */
  async create({
    name,
    description,
    price,
    tags,
    images,
    authorId,
  }: {
    name: string;
    description: string;
    price: string;
    tags: string[];
    images: string[];
    authorId: string;
  }) {
    // connectOrCreate 로직
    const tagsConnectOrCreate: Prisma.TagUpdateManyWithoutItemsNestedInput["connectOrCreate"] =
      tags.map((tagName) => ({
        where: { name: tagName },
        create: { name: tagName },
      }));

    return await this.prisma.item.create({
      data: {
        name,
        description,
        price,
        images,
        authorId,
        tags: {
          connectOrCreate: tagsConnectOrCreate,
        },
      },
      include: {
        tags: true,
      },
    });
  }

  /** 상품 수정 */
  async update(
    itemId: string,
    data: { tags?: string[] } & Prisma.ItemUpdateInput
  ) {
    const { tags: tagNames, ...itemData } = data;
    // 태그가 있을 경우에만 쿼리 생성
    const tagsUpdate: Prisma.TagUpdateManyWithoutItemsNestedInput | undefined =
      tagNames
        ? {
            connectOrCreate: tagNames.map((tagName) => ({
              where: { name: tagName },
              create: { name: tagName },
            })),
          }
        : undefined;

    return await this.prisma.item.update({
      where: { id: itemId },
      data: {
        ...itemData,
        tags: tagsUpdate,
      },
      include: {
        tags: true,
      },
    });
  }

  /** 상품 삭제 */
  async delete(itemId: string) {
    return await this.prisma.item.delete({
      where: { id: itemId },
    });
  }

  // 논리적 삭제 예시
  // async softDelete(itemId) {
  //   return await this.prisma.item.update({
  //     where: { id: itemId },
  //     data: { deleteAt: new Date() },
  //   });
  // }

  /** 아이디로 댓글 찾기 */
  async findByCommentId(commentId: string) {
    try {
      return await this.prisma.itemComment.findUnique({
        where: { id: commentId },
      });
    } catch (error) {
      console.error("댓글 삭제 레포지토리 오류:",error)
      throw error
    }
  }

  /** item댓글 생성 */
  async commentCreate(itemId: string, userId: string, context: string) {
    return await this.prisma.itemComment.create({
      data: {
        context,
        item: {
          connect: { id: itemId },
        },
        author: {
          connect: { id: userId },
        },
      },
      include: {
        author: {
          select: {
            nickname: true,
            userProfile: true,
          },
        },
      },
    });
  }

  /** item 댓글 삭제 */
  async deleteComment(commentId: string) {
    return await this.prisma.itemComment.delete({
      where: { id: commentId },
    });
  }
}

export const itemRepository = new ItemRepository(prisma);
