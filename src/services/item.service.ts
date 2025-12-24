import {
  NotFoundException,
  UnAuthorizedException,
} from "../common/exceptions/error";
import { NOT_FOUND_ITEM } from "../common/constants/index";
import {
  ItemRepository,
  itemRepository,
} from "../repositories/item.repository";
import { Prisma } from "../generated/client";
import fs from "fs/promises";
import path from "path";
import { ItemUpdateDto } from "../types/item";

/** Multer File Type */
type UploadFile = {
  path: string;
  [key: string]: any;
};

// "di"
export class ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  /** 상품 목록 조회 */
  async getItems({
    page,
    limit,
    keyword,
    orderBy,
  }: {
    page: number;
    limit: number;
    keyword?: string;
    orderBy: "recent" | "oldest";
  }) {
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

  /** 상품 상세 조회 */
  async getItemById(itemId: string) {
    const item = await this.itemRepository.findById(itemId);

    if (!item) {
      throw new NotFoundException(NOT_FOUND_ITEM);
    }
    return item;
  }

  async createItem({
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
    images: UploadFile[];
    authorId: string
  }) {
    const imageUrls = images.map((file: UploadFile) => file.path);

    try {
      const newItem = await this.itemRepository.create({
        name,
        description,
        price,
        tags,
        images: imageUrls,
        authorId,
      });
      return newItem;
    } catch (error) {
      //  DB저장 실패시 업로드된 물리적으로 파일삭제(롤백)
      if (images && images.length > 0) {
        await this.rollbackUploadFiles(images);
      }
      throw error
    }
  }

  /** 상품  업데이트 */
  async updateItem(itemId: string, data: ItemUpdateDto) {
    try {
      const updatedItem = await this.itemRepository.update(itemId, data);
      return updatedItem;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(NOT_FOUND_ITEM);
        }
      }
      throw error;
    }
  }

  /** 상품 삭제 */
  async deleteItem(itemId: string, currentUserId: string) {
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundException(NOT_FOUND_ITEM);
    }

    if (item.authorId !== currentUserId) {
      throw new UnAuthorizedException("삭제 권한이 없습니다.");
    }

    try {
      await this.itemRepository.delete(itemId);
    } catch (error) {
      if (error  instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(NOT_FOUND_ITEM);
        }
      }
      throw error;
    }
  }

  // ---- helper ----
  /** 업로된 파일 물리적 삭제 헬퍼 */
  private async rollbackUploadFiles(files: UploadFile[]):Promise<void> {
    const deletePromise = files.map(async (file) => {
      try {
        // file.path가 전체 경로인 경우와 상대인 경우
        const  filePath = path.isAbsolute(file.path)
          ? file.path
          : path.join(process.cwd(), file.path)
          await fs.unlink(filePath)
          console.log(`[Rollback] 파일 삭제 성공: ${filePath}`)
      } catch (error) {
        console.log(`[Rollback] 파일 삭제 실패: ${file.path}`, error);
      }
    });
    await Promise.all(deletePromise);
  }
}

export const itemService = new ItemService(itemRepository);
