import type { Express } from "express";

declare global {
  namespace Express {
    interface Request {
      valid?: boolean;
      auth?: {
        id: string;
        iat: number;
        exp: number;
        // JWT Payload
      };
    }
  }
}
