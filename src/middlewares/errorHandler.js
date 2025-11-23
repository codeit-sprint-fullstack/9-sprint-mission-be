import { isDevelopment } from "../config/config.js";
import { HttpException } from "../common/exceptions/index.js";

export const errorHandler = (error, req, res, next) => {
  console.error("error", error);

  if (error.name === "Unauthorized") {
    return res.status(401).json({
      success: false,
      message: error.message || "인증되지 않은 사용자입니다",
    });
  }

  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  let result = {
    success: false,
    message: "Internal Server Error",
  };

  /** @see https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error/stack */
  if (isDevelopment) {
    result = { ...result, stack: error.stack, originalMessage: error.message };
  }

  return res.status(500).json(result);
};
