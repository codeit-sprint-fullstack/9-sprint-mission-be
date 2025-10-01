import { BadRequestException } from '../err/badRequestException.js';

export const validateComments = (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    throw new BadRequestException('댓글의 내용은 존재해야합니다.');
  }

  next();
};
