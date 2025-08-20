import { Router } from 'express';

import StudentSubjectScoreController from '@src/controllers/student/student-subject-score.controller';
import systemMiddleware from '@src/middlewares/system.middleware';
import studentScoreValidator from '@src/utils/validators/student/student-score.validator';

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
      .post(systemMiddleware.validateRequestBody(studentScoreValidator.createScore), this.create);

    this.router
      .route('/:id')
      .put(systemMiddleware.formatRequestParamId('id'), this.update)
      .delete(systemMiddleware.formatRequestParamId('id'), this.delete);
  }
}

export default new StudentScoreRoutes().router;
