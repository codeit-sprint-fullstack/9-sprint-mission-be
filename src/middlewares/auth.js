import { expressjwt } from "express-jwt";
import passport from "../config/passport.js";
import { HttpStatus } from "../common/constants/httpStatus.js";
import { ALREADY_AUTHENTICATED } from "../common/constants/errorMessage.js";

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

const alreadyAuthenticated = (req, res, next) => {
  const { accessToken } = req.cookies;
  if (accessToken) {
    return res.status(HttpStatus.FORBIDDEN).json({
      success: false,
      message: ALREADY_AUTHENTICATED,
    });
  }
  next();
};

export const auth = {
  verifyAccessToken,
  requireRefreshToken,
  requireGoogleStrategy,
  requireGoogleScope,
  alreadyAuthenticated,
};
