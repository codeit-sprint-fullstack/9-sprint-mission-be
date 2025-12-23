import type { Request, Response, NextFunction } from "express";
import { isDevelopment } from "../config/config.js";

/** CORS 설정 미들웨어 */
export const cors = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const origin = req.headers.origin || req.headers.host || "";

  const whiteList: string[] = [
    "https://pandasmarket.netlify.app",
    "http://localhost:3000",
  ];
  const isAllowed = isDevelopment || whiteList.includes(origin);

  if (isAllowed) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  /** 표준 CORS 헤더 설정 */
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // No Content
  }
  next();
};
