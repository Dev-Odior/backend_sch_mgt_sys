import { Router } from 'express';

import authMiddleware from '@src/middlewares/auth.middleware';
import staffManagementRoutes from './staff-management.route';
import studentManagementRoute from './student-management.route';

class UserManagementRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.use(authMiddleware.validateUserAccess, authMiddleware.validateAdminAccess);

    this.router.use('/staff', staffManagementRoutes);

    this.router.use('/student', studentManagementRoute);
  }
}

export default new UserManagementRoutes().router;
