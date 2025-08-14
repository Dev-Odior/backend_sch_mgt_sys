import { Router } from 'express';

import ClassController from '@src/controllers/class/class.controller';

class ClassRoutes extends ClassController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.route('').get(this.index);
  }
}

export default new ClassRoutes().router;
