import { Router } from 'express';

import StudentController from '@src/controllers/student/student.controller';

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

    this.router.route('/:id').get(this.get);
  }
}

export default new StudentRoutes().router;
