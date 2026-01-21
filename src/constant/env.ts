import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(path.resolve(), ".env") });

export const HTTP_PORT = process.env.HTTP_PORT ?? 3000;
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET ?? "secret";
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET ?? "secret";
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI ?? "";
