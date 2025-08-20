import { Router } from 'express';
import authMiddleware from '@src/middlewares/auth.middleware';
import DashboardController from '@src/controllers/dashboard/dashboard.controller';

class DashboardRoutes extends DashboardController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.use(authMiddleware.validateUserAccess, authMiddleware.validateAdminAccess);

    this.router.route('/').get(this.index);
  }
}

export default new DashboardRoutes().router;
