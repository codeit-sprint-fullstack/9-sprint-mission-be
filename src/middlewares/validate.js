import z from "zod";
import { HttpStatus } from "../common/constants/httpStatus.js";

export const validateQuery = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.query);
    next();
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "유효성 검사 실패",
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    next(error);
  }
};

export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError && Array.isArray(error.errors)) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "유효성 검사 실패",
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
    next(error);
  }
};
