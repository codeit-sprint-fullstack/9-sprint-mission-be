import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  CONFLICT_USER,
  FAILED_SIGNIN_INPUT,
  FAILED_SIGNUP_INPUT,
} from "../common/constants/index.js";
import {
  BadRequestException,
  ConflictException,
  UnAuthorizedException,
  InternalServerException,
} from "../common/exceptions/index.js";
import { userRepository } from "../repositories/user.repository.js";

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async createUser({ email, nickname, password }) {
    if (!email || !nickname || !password) {
      throw new BadRequestException(FAILED_SIGNUP_INPUT);
    }

    try {
      // 중복된 유저
      const existedUser = await this.userRepository.findByEmail(email);

      if (existedUser) {
        throw new ConflictException(CONFLICT_USER);
      }

      const encryptedPassword = await this.hashPassword(password, 10);

      const createdUser = await this.userRepository.save({
        email,
        nickname,
        encryptedPassword,
      });
      return this.filterSensitiveUserData(createdUser);
    } catch (error) {
      throw new InternalServerException(
        "데이터베이스 작업 중 오류가 발생했습니다."
      );
    }
  }

  async getUser({ email, password }) {
    if (!email || !password) {
      throw new BadRequestException(FAILED_SIGNIN_INPUT);
    }

    try {
      const user = await this.userRepository.findByEmail(email);
      // 인증실패
      if (!user) {
        throw new UnAuthorizedException("이메일 이나 비밀번호가 틀립니다.");
      }

      await this.verifyPassword(password, user.encryptedPassword);
      return this.filterSensitiveUserData(user);
    } catch (error) {
      if (error.code === "401") throw error;
      // 그냥 기본 에러메시지 출력
      throw new InternalServerException();
    }
  }

  async updateUser(userId, data) {
    const updatedUser = await this.userRepository.update(userId, data);
    return this.filterSensitiveUserData(updatedUser);
  }

  async refreshToken(userId, refreshToken) {
    const user = await userRepository.findById(userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnAuthorizedException();
    }

    const newAccessToken = this.createToken(user);
    const newRefreshToken = this.createToken(user, "refresh");

    // sliding session a -> b -> b를 서버에서도 알수있게 업데이트
    await this.userRepository.update(userId, { refreshToken: newRefreshToken });

    return { newAccessToken, newRefreshToken };
  }

  async oauthCreateOrUpdate(provider, providerId, email, nickname) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return userRepository.update(existingUser.id, {
        provider,
        providerId,
        nickname,
      });
    } else {
      return userRepository.save({
        provider,
        providerId,
        email,
        nickname,
      });
    }
  }

  // ------------- Helper 메서드 ------------
  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  filterSensitiveUserData(user) {
    const { encryptedPassword, refreshToken, ...rest } = user;
    return rest;
  }

  async verifyPassword(userInputPassword, password) {
    const isMatch = await bcrypt.compare(userInputPassword, password);
    if (!isMatch) {
      throw new UnAuthorizedException("비밀번호가 틀립니다.");
    }
  }

  createToken(user, type) {
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: type === "refresh" ? "2w" : "30m",
    });
    return token;
  }
}

export const userService = new UserService(userRepository);
