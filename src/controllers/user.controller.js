import { HttpStatus } from "../common/constants/index.js";

export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getMe = async (req, res, next) => {
    try {
      const { accessToken } = req.cookies;
      const user = await this.userService.getAuthenticatedUser(accessToken);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "인증 성공",
        data: user,
      });
    } catch (error) {
      next(error);
      return;
    }
  };
}
