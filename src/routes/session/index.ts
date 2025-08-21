import AcademicSessionController from '@src/controllers/academic-session/academic-session.controller';
import authMiddleware from '@src/middlewares/auth.middleware';
import systemMiddleware from '@src/middlewares/system.middleware';
import onboardingValidator from '@src/utils/validators/onboarding/onboarding.validator';
import { Router } from 'express';

class AcademicSessionRoutes extends AcademicSessionController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.use(authMiddleware.validateUserAccess, authMiddleware.validateAdminAccess);

    this.router
      .route('/')
      .post(
        systemMiddleware.validateRequestBody(onboardingValidator.academicSessionCreation),
        this.create,
      )
      .get(this.index);

    this.router
      .route('/toggle')
      .patch(systemMiddleware.formatRequestParamId('id'), this.toggleActive);
  }
}

export default new AcademicSessionRoutes().router;
