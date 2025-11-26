import { BadRequestException } from '../err/badRequestException.js';

export const validateProducts = (req, res, next) => {
  const { name, description, price, tags, image } = req.body;

  if (!name || name.trim().length > 10) {
    throw new BadRequestException(
      '상품명은 존재해야하며, 10자 이내여야 합니다.',
    );
  }

  if (
    !description ||
    description.trim().length < 10 ||
    description.trim().length > 100
  ) {
    throw new BadRequestException(
      '상품 설명은 존재해야하며, 10자 이상, 100자 이내여야 합니다.',
    );
  }

  if (!price || isNaN(price)) {
    throw new BadRequestException('판매 가격은 존재해야하며, 숫자여야 합니다.');
  }

  if (!tags || !tags.length) {
    throw new BadRequestException('태그는 존재해야 합니다.');
  }

  if (!image || !tags.length) {
    throw new BadRequestException('상품 이미지는 존재해야 합니다.');
  }

  next();
};
