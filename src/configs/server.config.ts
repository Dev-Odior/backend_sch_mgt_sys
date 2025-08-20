import { config } from 'dotenv';
import debug from 'debug';

config();

class ServerConfig {
  public PORT = process.env.PORT ? Number(process.env.PORT) : 3009;

  public NODE_ENV = process.env.NODE_ENV || 'development';

  public BASE_URL = process.env.BASE_URL;

  public ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

  public FRONTEND_URL = process.env.FRONTEND_URL;

  public RABBITMQ_URI = process.env.RABBITMQ_URI;

  public BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS);

  public DEFAULT_USER_PROFILE_PASSWORD = process.env.DEFAULT_USER_PROFILE_PASSWORD;

  public RUN_DEFAULT_DATA_MIGRATION =
    process.env.RUN_DEFAULT_DATA_MIGRATION == 'true' ? true : false;

  public DEBUG = this.NODE_ENV === 'development' ? debug('dev') : console.log;

  public EMAIL_HOST = process.env.EMAIL_HOST;
  public EMAIL_PORT = process.env.EMAIL_PORT;
  public EMAIL_USER = process.env.EMAIL_USER;
  public EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
  public EMAIL_SENDER = process.env.EMAIL_SENDER;
}

export default new ServerConfig();
