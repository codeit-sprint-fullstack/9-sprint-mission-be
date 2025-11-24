import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import usersRepository from '../repository/users.repository.js';
import {
  validateUser,
  validateLogin,
  validateUpdate,
} from '../validators/validateUser.js';
import { ConflictException } from '../err/conflictException.js';
import { UnauthorizedException } from '../err/unauthorizedException.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { config } from '../config/config.js';

export const authRouter = express.Router();

// 회원가입
authRouter.post('/signup', validateUser, async (req, res, next) => {
  try {
    const { email, nickname, password } = req.body;

    const existingUser = await usersRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('이미 사용중인 이메일입니다.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await usersRepository.createUser({
      email,
      nickname,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      data: {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
      },
    });
  } catch (err) {
    next(err);
  }
});

// 로그인
authRouter.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await usersRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호를 확인해주세요.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호를 확인해주세요.');
    }

    // Access Token 생성 (6시간)
    const accessToken = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
      expiresIn: '6h',
    });

    // Refresh Token 생성 (1주일)
    const refreshToken = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
      expiresIn: '1w',
    });

    // Refresh Token을 DB에 저장
    await usersRepository.updateUserById(user.id, { refreshToken });

    res.cookie('authorization', `Bearer ${accessToken}`);
    res.cookie('refreshToken', `Bearer ${refreshToken}`);
    res.json({ success: true, message: '로그인에 성공했습니다.' });
  } catch (err) {
    next(err);
  }
});

// 로그아웃
authRouter.post('/logout', authMiddleware, async (req, res, next) => {
  try {
    await usersRepository.updateUserById(req.user.id, { refreshToken: null });
    res.clearCookie('authorization');
    res.clearCookie('refreshToken');
    res.json({ success: true, message: '로그아웃 되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// 내 정보 조회
authRouter.get('/me', authMiddleware, (req, res) => {
  const user = req.user;
  res.json({
    success: true,
    data: { id: user.id, email: user.email, name: user.name },
  });
});

// 내 정보 수정
authRouter.patch(
  '/me',
  authMiddleware,
  validateUpdate,
  async (req, res, next) => {
    try {
      const { id } = req.user;
      const { name } = req.body;
      const updatedUser = await usersRepository.updateUserById(id, { name });
      res.json({
        success: true,
        message: '사용자 정보가 수정되었습니다.',
        data: { id: updatedUser.id, name: updatedUser.name },
      });
    } catch (err) {
      next(err);
    }
  },
);

// 회원 탈퇴
authRouter.delete('/me', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.user;
    await usersRepository.deleteUserById(id);
    res.clearCookie('authorization');
    res.clearCookie('refreshToken');
    res.json({ success: true, message: '회원 탈퇴가 완료되었습니다.' });
  } catch (err) {
    next(err);
  }
});
