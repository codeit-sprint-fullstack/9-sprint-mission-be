import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  CONFLICT_USER,
  FAILED_SIGNIN_INPUT,
  FAILED_SIGNUP_INPUT,
} from "../common/constants/index";
import {
  BadRequestException,
  ConflictException,
  UnAuthorizedException,
} from "../common/exceptions/error";
import {
  AuthRepository,
  authRepository,
} from "../repositories/auth.repository";
import { User, UserProfile } from "../types/user";
import { config } from "@config/config";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  /** 새로운 유저 생성 (회원가입) */
  async createUser(data: SignUpDto): Promise<UserProfile> {
    const { email, nickname, password } = data;
    if (!email || !nickname || !password) {
      throw new BadRequestException(FAILED_SIGNUP_INPUT);
    }
    // 중복된 유저
    const existedUser = await this.authRepository.findByEmail(email);

    if (existedUser) {
      throw new ConflictException(CONFLICT_USER);
    }

    const encryptedPassword = await this.hashPassword(password);

    const createdUser = await this.authRepository.save({
      email,
      nickname,
      encryptedPassword,
    });
    return this.filterSensitiveUserData(createdUser);
  }

  /** 유저 인증 (로그인)*/
  async getUser(
    data: LoginInDto 
  ): Promise<UserProfile> {
    const { email, password } = data;

    if (!email || !password) {
      throw new BadRequestException(FAILED_SIGNIN_INPUT);
    }

    const user = await this.authRepository.findByEmail(email);
    if (!user || !user.encryptedPassword) {
      throw new UnAuthorizedException("이메일 이나 비밀번호가 틀립니다.");
    }

    // 비밀번호 검증 (실패시 내부에서 UnAuthorizedException)
    await this.verifyPassword(password, user.encryptedPassword);
    return this.filterSensitiveUserData(user);
  }

  /** 유저 정보 업데이트 */
  async updateUser(userId: string, data: Partial<User>): Promise<UserProfile> {
    const updatedUser = await this.authRepository.update(userId, data);
    return this.filterSensitiveUserData(updatedUser);
  }

  /** 토큰 갱신 */
  async refreshToken(userId: string, refreshToken: string) {
    const user = await authRepository.findById(userId);
    // DB와 저장된 토큰 대조 (Sliding Session)
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnAuthorizedException("유효하지 않은 리프레시 토큰입니다.");
    }

    const newAccessToken = this.createToken(user);
    const newRefreshToken = this.createToken(user, "refresh");

    // sliding session a -> b -> b를 서버에서도 알수있게 업데이트
    await this.authRepository.update(userId, { refreshToken: newRefreshToken });

    return { newAccessToken, newRefreshToken };
  }

  /** OAuth 유저 생성 또는 업데이트 */
  async oauthCreateOrUpdate(
    provider: string,
    providerId: string,
    email: string,
    nickname: string
  ): Promise<User> {
    const existingUser = await this.authRepository.findByEmail(email);

    if (existingUser) {
      return await this.authRepository.update(existingUser.id, {
        provider,
        providerId,
        nickname,
      });
    } else {
      return await this.authRepository.createOrUpdate(
        provider,
        providerId,
        email,
        nickname
      );
    }
  }

  // ------------- Helper 메서드 ------------
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(userInput: string, hashed: string): Promise<void> {
    const isMatch = await bcrypt.compare(userInput, hashed);
    if (!isMatch) {
      throw new UnAuthorizedException("비밀번호가 틀립니다.");
    }
  }

  /** token 생성 로직 */
  createToken(
    user: Pick<User, "id">,
    type: "refresh" | "access" = "access"
  ): string {
    const payload = { userId: user.id };
    const secret = config.JWT_SECRET;
    const expiresIn = type === "refresh" ? "14d" : "30m";
    return jwt.sign(payload, secret, { expiresIn });
  }

  private filterSensitiveUserData(user: User): UserProfile {
    const { encryptedPassword, refreshToken, ...rest } = user;
    return rest as UserProfile;
  }
}

export const authService = new AuthService(authRepository);
