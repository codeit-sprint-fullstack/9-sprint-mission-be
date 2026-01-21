import { HttpException } from "./HttpException";

export class UnprocessableEntityException extends HttpException {
  constructor(message: string) {
    super({
      status: 422,
      name: "Unprocessable Entity",
      message,
    });
  }
}
