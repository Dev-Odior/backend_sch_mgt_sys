import { Router, Request, Response } from 'express';

import { serverConfig } from '@src/configs';
import systemMiddleware from '@src/middlewares/system.middleware';
import { NotFoundError } from '@src/errors/indeex';

// import authMiddleware from '@src/middlewares/auth.middleware';


class Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.get('/', (req: Request, res: Response) =>
      res.status(200).json({
        message: 'School Management System Backend',
        data: {
          environment: serverConfig.NODE_ENV,
          version: '1.0.0',
        },
      }),
    );

    this.router.use(systemMiddleware.formatRequestQuery);

    // this.router.use('/auth', authRoutes);

    // this.router.use('/me', authMiddleware.validateUserAccess, meRoutes);

    // this.router.use('/user', userRoutes);

    // this.router.use('/categories', authMiddleware.validateUserAccess, categoryRoutes);

    // this.router.use('/articles', authMiddleware.validateUserAccess, articleRoutes);

    // this.router.use('/utilities', utilityRoutes);

    this.router.all('*', () => {
      throw new NotFoundError('Resource not found.');
    });
  }
}

export default new Routes().router;
