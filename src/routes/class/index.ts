import { Router } from 'express';

import authMiddleware from '@src/middlewares/auth.middleware';
import classSubjectRoutes from './class-subject.route';
import classRoutes from './class.route';

class ClassRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.use(authMiddleware.validateUserAccess, authMiddleware.validateAdminTeacherAccess);

    this.router.use('', classRoutes);

    this.router.use('/subject', classSubjectRoutes);
  }
}

export default new ClassRoutes().router;
