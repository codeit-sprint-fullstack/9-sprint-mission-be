import { BadRequestException } from '../err/badRequestException.js';

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export const validateUser = (req, res, next) => {
  const { email, nickname, password } = req.body;

  if (!email || !emailRegex.test(email)) {
    throw new BadRequestException('유효한 이메일 형식이 아닙니다.');
  }
  if (!nickname) {
    throw new BadRequestException('이름을 입력해주세요.');
  }
  if (!password || password.length < 6) {
    throw new BadRequestException('비밀번호는 6자 이상이어야 합니다.');
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    throw new BadRequestException('이메일을 입력해주세요.');
  }
  if (!password) {
    throw new BadRequestException('비밀번호를 입력해주세요.');
  }

  next();
};

export const validateUpdate = (req, res, next) => {
  const { nickname } = req.body;
  if (!nickname) {
    throw new BadRequestException('수정할 이름을 입력해주세요.');
  }
  next();
};
