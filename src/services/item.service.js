import { NotFoundException } from "../common/exceptions/index.js";
import { NOT_FOUND_ITEM } from "../common/constants/index.js";
import { itemRepository } from "../repositories/item.repository.js";

// "di"
export class ItemService {
  constructor(itemRepository) {
    this.itemRepository = itemRepository;
  }

  async getItems({ page, limit, keyword, orderBy }) {
    const skip = (page - 1) * limit;

    const { items, total } = await this.itemRepository.findAll({
      keyword,
      orderBy,
      skip,
      take: limit,
    });
    return {
      items,
      total,
      totalPage: Math.ceil(total / limit),
    };
  }

  async getItemById(itemId) {
    const item = await this.itemRepository.findById(itemId);

    if (!item) {
      throw new NotFoundException(NOT_FOUND_ITEM);
    }
    return item;
  }

  async createItem(data) {
    return await this.itemRepository.create(data);
  }

  async updateItem(itemId, data) {
    try {
      return await this.itemRepository.update(itemId, data);
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(NOT_FOUND_ITEM);
      }
      throw error;
    }
  }

  async deleteItem(itemId) {
    try {
      const deletedItem = await this.itemRepository.delete(itemId);
      return deletedItem;
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(NOT_FOUND_ITEM);
      }
      throw error;
    }
  }
}

export const itemService = new ItemService(itemRepository);
