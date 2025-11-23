import {
  INVALID_OR_EXPIRED_TOKEN,
  NOT_FOUND_USER,
  REQUIRED_AUTHENTICATED,
} from "../common/constants/index.js";
import {
  NotFoundException,
  UnAuthorizedException,
} from "../common/exceptions/index.js";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAuthenticatedUser(accessToken) {
    if (!accessToken) {
      throw new UnAuthorizedException(REQUIRED_AUTHENTICATED);
    }

    let decodedToken;
    try {
      decodedToken = this.verifyToken(accessToken);
    } catch (error) {
      throw new UnAuthorizedException(INVALID_OR_EXPIRED_TOKEN);
    }

    const userId = decodedToken.userId;
    console.log(userId);
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException(NOT_FOUND_USER);
    }

    return user;
  }

  // ---- helper method ---
  verifyToken(accessToken) {
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    return decodedToken;
  }
}

export const userService = new UserService(userRepository);
