import { Router } from 'express';

import StudentSubjectScoreController from '@src/controllers/student/student-subject-score.controller';
import systemMiddleware from '@src/middlewares/system.middleware';
import studentScoreValidator from '@src/utils/validators/student/student-score.validator';
import authMiddleware from '@src/middlewares/auth.middleware';

class StudentScoreRoutes extends StudentSubjectScoreController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router
      .route('/')
      .get(this.index)
      .post(
        authMiddleware.validateAdminTeacherAccess,
        systemMiddleware.validateRequestBody(studentScoreValidator.createScore),
        this.create,
      );

    this.router
      .route('/:id')
      .put(
        authMiddleware.validateAdminTeacherAccess,
        systemMiddleware.formatRequestParamId('id'),
        this.update,
      )
      .delete(
        authMiddleware.validateAdminTeacherAccess,
        systemMiddleware.formatRequestParamId('id'),
        this.delete,
      );

    this.router
      .route('/latest/:studentId')
      .get(systemMiddleware.formatRequestParamId('studentId'), this.lastScore);
  }
}

export default new StudentScoreRoutes().router;
