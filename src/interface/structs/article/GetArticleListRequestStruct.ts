import {
  coerce,
  optional,
  object,
  integer,
  string,
  min,
  max,
  enums,
  nonempty,
  defaulted,
} from "superstruct";

export const GetArticleListRequestStruct = object({
  cursor: defaulted(
    coerce(min(integer(), 0), string(), (value) => Number.parseInt(value, 10)),
    0
  ),
  limit: defaulted(
    coerce(max(min(integer(), 1), 10), string(), (value) =>
      Number.parseInt(value, 10)
    ),
    10
  ),
  orderBy: defaulted(enums(["recent", "favorite"]), "recent"),
  keyword: optional(nonempty(string())),
});
