import { HttpException } from "./HttpException";

export class ForbiddenException extends HttpException {
  constructor(message: string) {
    super({
      status: 403,
      name: "Forbidden",
      message,
    });
  }
}
