import {
  NotFoundException,
  UnAuthorizedException,
} from "../common/exceptions/index.js";
import { NOT_FOUND_ITEM } from "../common/constants/index.js";
import { itemRepository } from "../repositories/item.repository.js";
import fs from "fs/promises";
import path from "path";

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

  async createItem({ name, description, price, tags, images, userId }) {
    const imageUrls = images.map((file) => file.path);

    try {
      const newItem = await this.itemRepository.create({
        name,
        description,
        price,
        tags,
        images: imageUrls,
        userId,
      });
      return newItem;
    } catch (error) {
      if (images && images.length > 0) {
        return this.rollbackUploadFiles(images);
      }
    }
  }

  async updateItem(itemId, data) {
    try {
      const updatedItem = await this.itemRepository.update(itemId, data);
      return updatedItem;
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(NOT_FOUND_ITEM);
      }
      throw error;
    }
  }

  async deleteItem(itemId, currentUserId) {
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      return new NotFoundException(NOT_FOUND_ITEM);
    }

    if (item.authorId !== currentUserId) {
      throw new UnAuthorizedException();
    }

    try {
      await this.itemRepository.delete(itemId);
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(NOT_FOUND_ITEM);
      }
      throw error;
    }
  }

  // ---- helper ----
  async rollbackUploadFiles(imageUrl) {
    const deleteUrl = imageUrl.map(async (url) => {
      const fileName = url.replace("/uploads/", "");
      const filePath = path.join(process.cwd(), "uploads", fileName);

      try {
        await fs.unlink(filePath);
        console.log(`롤백 - 파일을 삭제:${filePath}`);
      } catch (unlinkError) {
        console.error(
          `롤백에러 - 파일 삭제를 실패함: ${filePath}`,
          unlinkError
        );
      }
    });
    await Promise.all(deleteUrl);
  }
}

export const itemService = new ItemService(itemRepository);
