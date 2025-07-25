import { config } from 'dotenv';
import debug from 'debug';

config();

class ServerConfig {
  public PORT = process.env.PORT ? Number(process.env.PORT) : 3009;

  public NODE_ENV = process.env.NODE_ENV || 'development';

  public BASE_URL = process.env.BASE_URL

  public ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

  public FRONTEND_URL = process.env.FRONTEND_URL;

  public RABBITMQ_URI = process.env.RABBITMQ_URI;

  public RUN_DEFAULT_DATA_MIGRATION =
    process.env.RUN_DEFAULT_DATA_MIGRATION == 'true' ? true : false;

  public DEBUG = this.NODE_ENV === 'development' ? debug('dev') : console.log;
}

export default new ServerConfig();
