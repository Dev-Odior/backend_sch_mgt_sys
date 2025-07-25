import { config } from 'dotenv';

config();

class DBConfig {
  public DB_URI = process.env.DB_URI;
}

export default new DBConfig();
