import { Router } from 'express';
import systemMiddleware from '@src/middlewares/system.middleware';

import StudentController from '@src/controllers/student/student.controller';
import managementValidator from '@src/utils/validators/user-management/management.validator';

class StudentManagementRoutes extends StudentController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.route('/').get(this.index);

    this.router
      .route('/promote')
      .post(
        systemMiddleware.validateRequestBody(managementValidator.promoteStudent),
        this.promoteStudent,
      );

    this.router
      .route('/delete/:studentId')
      .delete(systemMiddleware.formatRequestParamId('studentId'), this.deleteStudent);
  }
}

export default new StudentManagementRoutes().router;
