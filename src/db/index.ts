import { Sequelize, Options } from 'sequelize';
import { serverConfig, dbConfig } from '@src/configs';
import { init as initModels } from '@src/db/models';
import defaults from './defaults';

class DB {
  public connection: Sequelize;
  private options: Options;

  constructor() {
    this.options = {
      logging: ['development', 'staging'].includes(serverConfig.NODE_ENV) ? console.log : false,
      dialect: 'postgres',
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
        },
      },
    };
  }

  public async connectDB() {
    try {
      this.connection = new Sequelize(dbConfig.DB_URI, this.options);
      initModels(this.connection);
      serverConfig.DEBUG('connected to database.');

      // This is for the migration if it exist
      if (serverConfig.NODE_ENV === 'development') {
        // await this.connection.sync();
        await this.connection.sync({ alter: true });
        // await this.connection.sync({ force: true });
        serverConfig.DEBUG('Db migrations completed.');
      }

      // This is for the default migration
      if (serverConfig.RUN_DEFAULT_DATA_MIGRATION) {
        await defaults.migrateDefaultAdmins();
      }

      return this.connection;
    } catch (error) {
      serverConfig.DEBUG(`failed to connect to database: ${error}`);
      throw error;
    }
  }

  // this is to close the db connection
  public async closeConnection() {
    if (this.connection) {
      try {
        await this.connection.close();
        serverConfig.DEBUG(`Database connection closed`);
      } catch (error) {
        serverConfig.DEBUG(`Error closing Database connection: ${error}`);
      }
    }
  }
}

export default new DB();
