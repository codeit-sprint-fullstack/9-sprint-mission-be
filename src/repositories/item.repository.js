import { prisma } from "../db/prisma.js";

export class ItemRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async findAll({ skip, take, orderBy, keyword }) {
    const sortOptions = {
      recent: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
    }[orderBy] ?? { createdAt: "desc" };

    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } },
          ],
        }
      : {};

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

  async findById(itemId) {
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

  async create({ name, description, price, tags, images, userId }) {
    const tagsConnectOrCreate = tags.map((tagName) => ({
      where: { name: tagName },
      create: { name: tagName },
    }));

    const newItem = await this.prisma.item.create({
      data: {
        name,
        description,
        price,
        images,
        authorId: userId,
        tags: {
          connectOrCreate: tagsConnectOrCreate,
        },
      },
      include: {
        tags: true,
      },
    });
    return newItem;
  }

  async update(itemId, data) {
    const { tags: tagNames, ...itemData } = data;

    const tagsConnectOrCreate = tagNames.map((tagName) => ({
      where: { name: tagName },
      create: { name: tagName },
    }));

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        ...itemData,
        tags: {
          connectOrCreate: tagsConnectOrCreate,
        },
      },
      include: {
        tags: true,
      },
    });
    return updatedItem;
  }

  async delete(itemId) {
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
}

export const itemRepository = new ItemRepository(prisma);
