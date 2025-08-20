import { Router } from 'express';

import StaffController from '@src/controllers/staff/staff.controller';
import authMiddleware from '@src/middlewares/auth.middleware';
import systemMiddleware from '@src/middlewares/system.middleware';

class StaffRoutes extends StaffController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.use(authMiddleware.validateUserAccess);

    this.router.route('/').get(this.index);

    this.router
      .route('/teacher-dashboard/:staffId')
      .get(systemMiddleware.formatRequestParamId('staffId'), this.teacherDashboardInfo);

    // this.router.route('/:id').get(this.get);
  }
}

export default new StaffRoutes().router;
