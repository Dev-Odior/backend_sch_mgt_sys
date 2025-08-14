import { Router } from 'express';
import StudentReportController from '@src/controllers/student/student-report.controller';

class StudentReportRoutes extends StudentReportController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.route('/').get(this.generateReport);
  }
}

export default new StudentReportRoutes().router;
