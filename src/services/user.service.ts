import {
  NOT_FOUND_USER,
} from "../common/constants/index";
import {
  NotFoundException,
} from "../common/exceptions/error";
import { UserRepository, userRepository } from "../repositories/user.repository";

export class UserService {
  constructor(private readonly userRepository:UserRepository) {}

  /**
   * 미들웨어에서 추출된 유저아이디 바탕으로 유저 정보를 반환 
   */
  async getAuthenticatedUser(userId: string) {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException(NOT_FOUND_USER);
    }

    const { password, refreshToken, ...userProfile} = user;
    return userProfile;
  }
}

export const userService = new UserService(userRepository);
