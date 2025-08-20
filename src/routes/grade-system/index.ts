import authMiddleware from '@src/middlewares/auth.middleware';
import { Router } from 'express';
import GradeSystemController from '@src/controllers/grade-system/grade-system.controller';

class GradeSystemRoutes extends GradeSystemController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.use(authMiddleware.validateUserAccess);

    this.router.route('/').get(this.index);
  }
}

export default new GradeSystemRoutes().router;
