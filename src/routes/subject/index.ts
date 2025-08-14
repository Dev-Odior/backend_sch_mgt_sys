import SubjectController from '@src/controllers/subject/staff.controller';
import authMiddleware from '@src/middlewares/auth.middleware';
import { Router } from 'express';

class SubjectRoutes extends SubjectController {
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

export default new SubjectRoutes().router;
