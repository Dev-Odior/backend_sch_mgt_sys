import { Router } from 'express';
import { AuthController } from '@src/controllers/auth';
import systemMiddleware from '@src/middlewares/system.middleware';
import authValidator from '@src/utils/validators/auth/auth.validator';
import authMiddleware from '@src/middlewares/auth.middleware';

class AuthRoutes extends AuthController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router
      .route('/')
      .post(systemMiddleware.validateRequestBody(authValidator.login), this.login);

    this.router
      .route('/login')
      .post(systemMiddleware.validateRequestBody(authValidator.login), this.loginUsers);

    this.router.use(authMiddleware.validateUserAccess, authMiddleware.validateAdminAccess);

    this.router
      .route('/staff-registration')
      .post(systemMiddleware.validateRequestBody(authValidator.createStaff), this.register);

    this.router
      .route('/student-registration')
      .post(
        systemMiddleware.validateRequestBody(authValidator.createStudent),
        this.registerStudent,
      );
  }
}

export default new AuthRoutes().router;
