import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";

import { isDevelopment } from "@config/config";
import { HttpException } from "../common/exceptions/error";

/** dev env 환경에선 에러 로그를 더 자세히 출력합니다. */
export const errorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (isDevelopment) {
    console.error("error", error);
  }

  /** express-jwt (UnauthorizedError) 처리 */
  if (error.name === "UnauthorizedError") {
    return res.status(401).json({
      success: false,
      message: error.message || "인증되지 않은 사용자입니다",
    });
  }

  /** 커스텀 HttpException */
  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
  let result: Record<string, any> = {
    success: false,
    message: "Internal Server Error",
  };

  /** @see https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error/stack */
  if (isDevelopment) {
    result = {
      ...result,
      stack: error.stack,
      originalMessage: error.message || result.message,
    };
  }

  return res.status(500).json(result);
};
