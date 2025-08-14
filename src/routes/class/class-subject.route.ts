import { Router } from 'express';

import ClassSubjectServiceController from '@src/controllers/class/class-subject.controller';
import systemMiddleware from '@src/middlewares/system.middleware';
import classSubjectValidator from '@src/utils/validators/class/class-subject.validator';

class ClassSubjectRoutes extends ClassSubjectServiceController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router
      .route('/')
      .post(systemMiddleware.validateRequestBody(classSubjectValidator.create), this.create);

    this.router
      .route('/:classId/:termId')
      .get(
        systemMiddleware.formatRequestParamId('termId'),
        systemMiddleware.formatRequestParamId('classId'),
        this.index,
      );

    this.router
      .route('/bulk')
      .post(
        systemMiddleware.validateRequestBody(classSubjectValidator.bulkCreate),
        this.bulkCreate,
      );
  }
}

export default new ClassSubjectRoutes().router;
