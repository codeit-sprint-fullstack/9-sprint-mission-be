import { z } from "zod";

export const getItemsSchema = z.object({
  page: z.string().default("1"),
  limit: z.string().default("10"),
  keyword: z.string().default(""),
  orderBy: z.enum(["recent", "favorite"]).default("recent"),
});
