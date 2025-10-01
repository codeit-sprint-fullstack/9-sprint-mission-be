import { BadRequestException } from '../err/badRequestException.js';

export const validateArticles = (req, res, next) => {
  const { title, content } = req.body;

  if (!title) {
    throw new BadRequestException('제목은 존재해야합니다.');
  }

  if (!content || content.trim().length < 10) {
    throw new BadRequestException(
      '내용은 존재해야하며, 10자 이상이여야 합니다.',
    );
  }

  next();
};
