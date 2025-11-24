import jwt from 'jsonwebtoken';
import usersRepository from '../repository/users.repository.js';
import { UnauthorizedException } from '../err/unauthorizedException.js';
import { config } from '../config/config.js';

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    if (!authorization) {
      throw new UnauthorizedException('인증 정보가 없습니다.');
    }
    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer' || !token) {
      throw new UnauthorizedException('지원하지 않는 인증 방식입니다.');
    }

    let decoded = verifyToken(token);

    // Access Token이 만료된 경우
    if (!decoded) {
      const { refreshToken: refreshTokenWithBearer } = req.cookies;
      if (!refreshTokenWithBearer) {
        throw new UnauthorizedException('인증 정보가 만료되었습니다.');
      }

      const [refreshTokenType, refreshToken] =
        refreshTokenWithBearer.split(' ');
      if (refreshTokenType !== 'Bearer' || !refreshToken) {
        throw new UnauthorizedException('지원하지 않는 인증 방식입니다.');
      }

      const decodedRefreshToken = verifyToken(refreshToken);
      if (!decodedRefreshToken) {
        throw new UnauthorizedException('인증 정보가 만료되었습니다.');
      }

      const user = await usersRepository.findUserById(
        decodedRefreshToken.userId,
      );
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('인증 정보가 유효하지 않습니다.');
      }

      // 새로운 Access Token 발급
      const newAccessToken = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
        expiresIn: '6h',
      });

      res.cookie('authorization', `Bearer ${newAccessToken}`);
      decoded = verifyToken(newAccessToken);
    }

    const user = await usersRepository.findUserById(decoded.userId);
    if (!user) {
      throw new UnauthorizedException(
        '인증 정보와 일치하는 사용자가 없습니다.',
      );
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
