import passport from "passport";
import {
  accessTokenStrategy,
  refreshTokenStrategy,
} from "../middlewares/passport/jwt.strategy.js";
import googleStrategy from "../middlewares/passport/google.strategy.js";

passport.use("access-token", accessTokenStrategy);
passport.use("refresh-token", refreshTokenStrategy);
passport.use("google", googleStrategy);

export default passport;
