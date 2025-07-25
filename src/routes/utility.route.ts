import { Router } from 'express';
import UtilityController from '@src/controllers/utility.controller';

class UtilityRoutes extends UtilityController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {}
}

export default new UtilityRoutes().router;
