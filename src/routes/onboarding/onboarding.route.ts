import { Router } from 'express';
import systemMiddleware from '@src/middlewares/system.middleware';
import OnboardingController from '@src/controllers/onboarding/onboarding.controller';
import authMiddleware from '@src/middlewares/auth.middleware';
import onboardingValidator from '@src/utils/validators/onboarding/onboarding.validator';

class OnboardingRoutes extends OnboardingController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.use(authMiddleware.validateUserAccess, authMiddleware.validateAdminAccess);

    this.router
      .route('/formula')
      .post(systemMiddleware.validateRequestBody(onboardingValidator.formula), this.createFormula);

    this.router
      .route('/school')
      .post(
        systemMiddleware.validateRequestBody(onboardingValidator.schoolCreation),
        this.createSchool,
      );
  }
}

export default new OnboardingRoutes().router;
