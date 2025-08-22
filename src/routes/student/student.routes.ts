import { Router } from 'express';

import StudentController from '@src/controllers/student/student.controller';
import systemMiddleware from '@src/middlewares/system.middleware';

class StudentRoutes extends StudentController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.route('/').get(this.index);

    this.router.route('/student-by-staff').get(this.studentByStaff);

    this.router
      .route('/:studentId')
      .get(systemMiddleware.formatRequestParamId('studentId'), this.get);
  }
}

export default new StudentRoutes().router;
