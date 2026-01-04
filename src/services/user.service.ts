import {
  NOT_FOUND_USER,
} from "../common/constants/index";
import {
  NotFoundException,
} from "../common/exceptions/error";
import { UserRepository, userRepository } from "../repositories/user.repository";
import { User } from "../types/user";

export class UserService {
  constructor(private readonly userRepository:UserRepository) {}

  /** 미들웨어에서 추출된 유저아이디 바탕으로 유저 정보를 반환 */
  async getAuthenticatedUser(userId: string):Promise<Pick<User,"id"  | "email" | "nickname">> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException(NOT_FOUND_USER);
    }

    return user;
  }
}

export const userService = new UserService(userRepository);
