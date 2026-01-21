import { HttpException } from "./HttpException";

export class InternalServerErrorException extends HttpException {
  constructor(message: string) {
    super({
      status: 500,
      name: "Internal Server Error",
      message,
    });
  }
}
