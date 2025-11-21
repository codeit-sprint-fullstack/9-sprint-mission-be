import { z } from "zod";

export const getItemsSchema = z.object({
  page: z.string().default("1"),
  limit: z.string().default("10"),
  keyword: z.string().default(""),
  orderBy: z.enum(["recent", "favorite"]).default("recent"),
});

export const createItemSchema = z.object({
  name: z.string().min(1).max(10, "상품 이름은 1~10글자여야 합니다."),
  description: z.string().min(10).max(100, "설명은 10~100글자여야 합니다."),
  price: z.number({ invalid_type_error: "가격은 숫자여야 합니다." }).min(1),
  tags: z.string().max(5, "태그는 5글자 이내여야 합니다.").optional(),
});

export const updateItemSchema = createItemSchema.partial();
