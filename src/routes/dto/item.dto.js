import { z } from "zod";

export const getItemsSchema = z.object({
  page: z.string().default("1"),
  limit: z.string().default("10"),
  keyword: z.string().default(""),
  orderBy: z.enum(["recent", "favorite"]).default("recent"),
});

export const createItemSchema = z.object({
  name: z
    .string()
    .min(1, "제목을 입력해주세요")
    .max(30, "상품 이름은 30자 이내입니다."),
  description: z
    .string()
    .min(10, "내용은 10자 이상 입력해주세요.")
    .max(100, "내용은 100자 이내여야 합니다."),
  price: z.string({ invalid_type_error: "가격은 문자여야 합니다." }).min(1),
  tags: z
    .array(
      z
        .string()
        .min(1, "태그 내용을 입력해주세요")
        .max(10, "태그는 10자 이하로 해주세요")
    )
    .min(1, "최소 1개 이상의 태그를 입력해주세요")
    .max(5, "태그는 최대 5개까지만 입력 가능합니다."),
  images: z.array(z.string().min(1, "이미지를 등록해야 합니다.")),
});

export const updateItemSchema = createItemSchema.partial();
