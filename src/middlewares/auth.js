import { expressjwt } from "express-jwt";
import passport from "../config/passport.js";

export const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

export const requireRefreshToken = passport.authenticate("refresh-token", {
  session: false,
});
