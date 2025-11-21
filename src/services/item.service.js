import { prisma } from "../db/prisma.js";
import { NotFoundException } from "../common/exceptions/index.js";
import { NOT_FOUND_ITEM } from "../common/constants/index.js";

// "get AllItems"
export class ItemService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async getItems({ page, limit, keyword, orderBy }) {
    const skip = (page - 1) * limit;

    const sortOptions = {
      recent: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
    }[orderBy] ?? { createdAt: "desc" };

    const where = {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ],
    };

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        orderBy: sortOptions,
        skip,
        take: limit,
      }),
      prisma.item.count({ where }),
    ]);

    return {
      items,
      total,
      totalPage: Math.ceil(total / limit),
    };
  }
  // getItemsById
  async getItemById(itemId) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
      include: { user: true },
    });

    if (!item) {
      throw new NotFoundException(NOT_FOUND_ITEM);
    }
    return item;
  }

  async createItem(data) {
    return await this.prisma.item.create({ data });
  }
  //patchItemHandler
  async patchItem(itemId, data) {
    try {
      const updateItem = await this.prisma.item.update({
        where: { id: itemId },
        data,
      });
      return updateItem;
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(NOT_FOUND_ITEM);
      }
      throw error;
    }
  }

  async deleteItem(itemId) {
    const deletedItem = await this.prisma.item.update({
      where: { id: itemId },
      data: { deletedAt: new Date() },
    });

    if (!deleteItem) {
      throw new NotFoundException(NOT_FOUND_ITEM);
    }
    return deletedItem;
  }
}

export const itemService = new ItemService(prisma);
