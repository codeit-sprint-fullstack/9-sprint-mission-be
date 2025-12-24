import type { Prisma } from "../generated/client";

// TODO: entity type 과 클라이언트에서 보내는 데이터 DTO를 분리해야한다.
export type Item = {
  id: string;
  authorId: string;
  name: string;
  description: string;
  price: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  itemComment: ItemComment;
};

export type ItemComment = {
  id: string;
  userId: string;
  itemId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderByType = "recent" | "oldest";
export type ItemUpdateDto = Omit<Prisma.ItemUpdateInput, "tags"> & {
    tags?: string[]
};
