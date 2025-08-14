import express, { Application, urlencoded } from 'express';
import { Server } from 'http';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { Sequelize } from 'sequelize';
import DB from '@src/db/';
import routes from '@src/routes/index';
import serverConfig from '@src/configs/server.config';
import systemMiddleware from '@src/middlewares/system.middleware';

class App {
  public app: Application;
  protected server!: Server;
  protected db: Sequelize | undefined;
  protected port: number = serverConfig.PORT;
  private readonly corsOptions: cors.CorsOptions;

  // This is the constructor for all the things we need
  constructor() {
    this.app = express();

    this.port = serverConfig.PORT;

    this.corsOptions = {
      origin: serverConfig.ALLOWED_ORIGINS != null ? serverConfig.ALLOWED_ORIGINS.split(',') : [],
    };

    // This is to initialize the database
    this.initializeDb();

    // This is to initalize the middleware and routes
    this.initializeMiddlewaresAndRoutes();

    //This is for the signals for graceful shutdown
    const signals = ['SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM'];

    signals.forEach((signal) => {
      process.on(signal, async (error) => {
        serverConfig.DEBUG(` \nReceived signal (${signal}) to terminate the application ${error}`);
        await this.shutDown();
      });
    });
  }

  // Class Method to initialize db
  private async initializeDb(): Promise<void> {
    this.db = await DB.connectDB();
  }

  // Class methods to build middleware and routes
  private initializeMiddlewaresAndRoutes(): void {
    this.app.use(bodyParser.json());
    this.app.use(urlencoded({ extended: false }));
    this.app.use(helmet());
    this.app.use(compression());

    if (serverConfig.NODE_ENV === 'development') {
      this.app.use(cors());
    } else {
      this.app.use(cors(this.corsOptions));
    }

    if (['development', 'staging', 'production'].includes(serverConfig.NODE_ENV)) {
      this.app.use(morgan('dev'));
    }

    this.app.use(routes);
    this.app.use(systemMiddleware.errorHandler());
  }

  // Class Method to initiate app listening
  public async start(): Promise<void> {
    // start express server
    this.server = this.app.listen(this.port, () => {
      serverConfig.DEBUG(
        `Server running on http://localhost:${this.port} in ${serverConfig.NODE_ENV} mode.\npress CTRL-C to stop`,
      );
    });
  }

  // for graceful shutdown
  private async shutDown(): Promise<void> {
    try {
      // Close server
      if (this.server) {
        await new Promise<void>((resolve) => {
          this.server?.close(() => {
            serverConfig.DEBUG('Http server closed');
            resolve();
          });
        });
      }

      // Close database connection
      await DB.closeConnection();

      serverConfig.DEBUG('Shutdown completed successfully\n');
    } catch (error) {
      serverConfig.DEBUG(`Error during shutdown: ${error}`);
    } finally {
      process.exit(0);
    }
  }
}

export const app = new App();
app.start();
