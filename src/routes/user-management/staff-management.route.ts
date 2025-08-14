import { Router } from 'express';
import systemMiddleware from '@src/middlewares/system.middleware';
import StaffController from '@src/controllers/staff/staff.controller';

class StaffManagementRoutes extends StaffController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.use(systemMiddleware.formatRequestParamId('staffId'));

    this.router
      .route('/deactivate/:staffId')
      .post(systemMiddleware.formatRequestParamId('staffId'), this.deactivateStaff);

    this.router.route('/assign-role/:staffId').post(this.assignRole);
  }
}

export default new StaffManagementRoutes().router;
