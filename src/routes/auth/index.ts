import { Router } from 'express';
import { AuthController } from '@src/controllers/auth';
import systemMiddleware from '@src/middlewares/system.middleware';
import authValidator from '@src/utils/validators/auth/auth.validator';

class AuthRoutes extends AuthController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router
      .route('/login')
      .get(systemMiddleware.validateRequestBody(authValidator.login), this.login);
  }
}

export default new AuthRoutes().router;
