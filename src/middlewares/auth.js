import { expressjwt } from "express-jwt";
import passport from "../config/passport.js";

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
const requireRefreshToken = passport.authenticate("refresh-token", {
  session: false,
});

const requireGoogleStrategy = passport.authenticate("google");
const requireGoogleScope = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const auth = {
  verifyAccessToken,
  requireRefreshToken,
  requireGoogleStrategy,
  requireGoogleScope,
};
