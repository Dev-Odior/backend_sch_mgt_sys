import { Router } from 'express';
import StudentReportController from '@src/controllers/student/student-report.controller';
import systemMiddleware from '@src/middlewares/system.middleware';

class StudentReportRoutes extends StudentReportController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router
      .route('/:studentId/:classId/:termId')
      .get(
        systemMiddleware.formatRequestParamId('studentId'),
        systemMiddleware.formatRequestParamId('classId'),
        systemMiddleware.formatRequestParamId('termId'),
        this.generateReport,
      );
  }
}

export default new StudentReportRoutes().router;
