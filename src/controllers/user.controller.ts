import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { BaseController } from "./base.controller";

export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  // @TODO DI pattern
  // public initializeRoutes(): Router {
  //     this.router.get('/me', this.getMe);
  //     return this.router
  // }

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken } = req.cookies;

      const user = await this.userService.getAuthenticatedUser(accessToken);

      return this.sendSuccess(res, user, "인증 성공", 200);
    } catch (error) {
      this.nextError(next, error);
    }
  };
}
