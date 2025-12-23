import type { Request, Response, NextFunction, RequestHandler } from "express";
import z from "zod";
import { HttpStatus } from "../common/constants/httpStatus.js";

/**
 * Query Parameter 유효성 검사
 * validateValue를 다시 req.query에 할당 -> 타입 안전성 확보
 */
export const validateQuery =
  <T>(schema: z.Schema<T>): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError)
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "유효성 검사 실패",
          errors: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      next(error);
    }
  };

/** Request Body  유효성 검사 미들웨어 */
export const validateBody =
  <T>(schema: z.Schema<T>): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "유효성 검사 실패",
          errors: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
