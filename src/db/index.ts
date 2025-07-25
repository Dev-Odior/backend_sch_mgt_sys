import { Sequelize, Options } from 'sequelize';
import { serverConfig, dbConfig } from '@src/configs';
import { init as initModels } from '@src/db/models';
import defaults from '@src/db/defaults';
// import Migration from '@src/db/migration';

class DB {
  public connection: Sequelize;
  private options: Options;

  constructor(private readonly DefaultData = defaults) {
    this.options = {
      logging: ['development', 'staging'].includes(serverConfig.NODE_ENV) ? console.log : false,
      dialect: 'mysql',
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
        // await this.connection.sync({ alter: true });
        // await this.connection.sync({ force: true });
        serverConfig.DEBUG('Db migrations completed.');
      }

      if (serverConfig.RUN_DEFAULT_DATA_MIGRATION) {
        await this.DefaultData.runDataMigration();
        serverConfig.DEBUG('Default data migration completed.');
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
