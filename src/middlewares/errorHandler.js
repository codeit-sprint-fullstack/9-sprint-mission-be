import { isDevelopment } from "../config/config.js";
import { HttpException } from "../common/exceptions/index.js";

export const errorHandler = (error, req, res, next) => {
  console.error("error", error);
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

  if (isDevelopment) {
    result = { ...result, error };
  }

  return res.status(500).json(result);
};
