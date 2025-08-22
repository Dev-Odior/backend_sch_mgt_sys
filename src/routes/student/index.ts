import { Router } from 'express';

import authMiddleware from '@src/middlewares/auth.middleware';
import studentScoreRoute from './student-score.route';
import studentRoutes from './student.routes';
import reportRoutes from './report.route';

class StudentRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.use(authMiddleware.validateUserAccess);

    this.router.use('/score', authMiddleware.validateAdminTeacherAccess, studentScoreRoute);

    this.router.use('/report', authMiddleware.validateAdminTeacherAccess, reportRoutes);

    this.router.use('/', studentRoutes);
  }
}

export default new StudentRoutes().router;
