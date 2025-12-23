import {
  Strategy as GoogleStrategy,
  type VerifyCallback,
  type Profile,
} from "passport-google-oauth20";
import { config } from "@config/config.js";
import { authService } from "../../services/auth.service.js";

const googleStrategyOptions = {
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/v1/auth/google/callback",
};

/**
 * 구글 인증 성공 후 실행되는 검증 함수
 * @param accessToken   - 구글에서 발급한 액세스 토큰
 * @param refreshToken  - 구글에서 발급한 리프레시 토큰
 * @param profile             - 구글에서 전달해준 사용자 프로필 정보
 * @param done               - Passport 완료 콜백 *
 */
async function verify(
  _accessToken: string,
  _refreshToken: string,
  profile: Profile,
  done: VerifyCallback
): Promise<void> {
  try {
    const email =
      profile.emails && profile.emails[0] ? profile.emails[0].value : "";
    const user = await authService.oauthCreateOrUpdate(
      profile.provider,
      profile.id,
      email,
      profile.displayName
    );
    done(null, user);
  } catch (error) {
    done(error as Error);
  }
}

const googleStrategy: GoogleStrategy = new GoogleStrategy(
  googleStrategyOptions,
  verify
);

export default googleStrategy;
