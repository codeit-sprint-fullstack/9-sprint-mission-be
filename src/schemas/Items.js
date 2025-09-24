import { z } from "zod";

export const getItemsSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  keyword: z.string().default(""),
  orderBy: z.enum(["recent", "favorite"]).default("recent"),
});