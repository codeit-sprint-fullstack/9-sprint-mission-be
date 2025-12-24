import { z } from "zod";

/**
 * 상품 목록 조회 스키마
 * - 쿼리 스트링은 기본적으로 스트링 z.coerce를 통해 숫자로 자동 변환 시킬수있다.
 */
export const getItemsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  keyword: z.string().optional().default(""),
  orderBy: z.enum(["recent", "favorite"]).default("recent"),
});

/**  상품 생성 스키마 */
export const createItemSchema = z.object({
  name: z
    .string()
    .min(1, "제목을 입력해주세요")
    .max(30, "상품 이름은 30자 이내입니다."),
  description: z
    .string()
    .min(10, "내용은 10자 이상 입력해주세요.")
    .max(100, "내용은 100자 이내여야 합니다."),
  price: z.string().min(1, "가격을 입력해주세요."),
  tags: z
    .array(
      z
        .string()
        .min(1, "태그 내용을 입력해주세요")
        .max(10, "태그는 10자 이하로 해주세요")
    )
    .min(1, "최소 1개 이상의 태그를 입력해주세요")
    .max(5, "태그는 최대 5개까지만 입력 가능합니다."),
  images: z
    .array(z.string().min(1, "이미지를 경로가 올바르지 않습니다."))
    .min(1, "이미지를 최소 한 장 등록해야 합니다."),
});

/**
 * 상품 수정스키마
 * - createItemSchema 필드들을 모두  옵셔널하게 만든다.
 */
export const updateItemSchema = createItemSchema.partial();

/** 스키마를 바탕으로 타입스크립트 타입추론 (DTO로 활용) */
export type GetItemsQuery = z.infer<typeof getItemsSchema>;
export type CreateItemDto = z.infer<typeof createItemSchema>;
export type UpdateItemDto = z.infer<typeof updateItemSchema>;
