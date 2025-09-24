import { BadRequestException } from "../errors/badRequestException.js";

const NAME_MIN_LEN = 1;
const NAME_MAX_LEN = 10;
const DISCRIBE_MIN_LEN = 10;
const DISCRIBE_MAX_LEN = 100;
const TAG_MAX_LEN = 5;

export const validateProduct = (req, res, next) => {
  const { name, description, price, tags } = req.body;
  try {
    if (
      !name ||
      name.trim().length > NAME_MAX_LEN ||
      name.trim().length < NAME_MIN_LEN
    ) {
      throw new BadRequestException(
        "상품이름은 1글자 이상 10자 이내여야 합니다",
      );
    }

    if (
      !description ||
      description.trim().length > DISCRIBE_MAX_LEN ||
      description.trim().length < DISCRIBE_MIN_LEN
    ) {
      throw new BadRequestException(
        "상품이름은 2글자 에서 100글자 사이여야 합니다",
      );
    }

    if (!price || Number.isNaN(price)) {
      throw new BadRequestException("숫자를 입력해주세요");
    }

    if (!tags || tags.trim().length > TAG_MAX_LEN) {
      throw new BadRequestException("5글자 이내로 입력해주세요");
    }
  } catch (error) {
    next(error);
    return;
  }

  next();
};
