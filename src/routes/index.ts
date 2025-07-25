import { Router, Request, Response } from 'express';
import { NotFoundError } from '@src/errors';
import { serverConfig } from '@src/configs';
import systemMiddleware from '@src/middlewares/system.middleware';
// import categoryRoutes from '@src/routes/category.route';
// import authRoutes from '@src/routes/auth';
// import userRoutes from '@src/routes/user';
// import meRoutes from '@src/routes/me';
// import articleRoutes from '@src/routes/article.route';

// import authMiddleware from '@src/middlewares/auth.middleware';
// import utilityRoutes from './utility.route';

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
