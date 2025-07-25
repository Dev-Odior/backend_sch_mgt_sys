import { config } from 'dotenv';

config();

class AuthConfig {
  public ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;

  public BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS);

  public VERIFICATION_SECRET = process.env.VERIFICATION_SECRET;

  public DEFAULT_USER_PROFILE_PASSWORD = process.env.DEFAULT_USER_PROFILE_PASSWORD;
}

export default new AuthConfig();
