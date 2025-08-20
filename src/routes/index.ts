import { Router, Request, Response } from 'express';

import { serverConfig } from '@src/configs';
import systemMiddleware from '@src/middlewares/system.middleware';
import { NotFoundError } from '@src/errors/indeex';
import authRoutes from '@src/routes/auth/index';
import userManagementRoutes from './user-management';
import onboardingRoutes from './onboarding/onboarding.route';
import classRoutes from './class';
import studentRoutes from './student';
import subjectRoutes from './subject';
import dashboardRoutes from './dashboard/dashboard.route';
import staffRoutes from './staff';
import termRoutes from './term';
import gradeSystemRoutes from './grade-system';

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

    this.router.use('/auth', authRoutes);

    this.router.use('/user-management', userManagementRoutes);

    this.router.use('/onboarding', onboardingRoutes);

    this.router.use('/class', classRoutes);

    this.router.use('/student', studentRoutes);

    this.router.use('/subject', subjectRoutes);

    this.router.use('/dashboard', dashboardRoutes);

    this.router.use('/staff', staffRoutes);

    this.router.use('/term', termRoutes);

    this.router.use('/grade-system', gradeSystemRoutes);

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
