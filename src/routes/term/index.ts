import TermController from '@src/controllers/term/term.controller';
import authMiddleware from '@src/middlewares/auth.middleware';
import systemMiddleware from '@src/middlewares/system.middleware';
import onboardingValidator from '@src/utils/validators/onboarding/onboarding.validator';
import { Router } from 'express';

class TermRoutes extends TermController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.use(authMiddleware.validateUserAccess);

    this.router
      .route('/')
      .get(this.index)
      .post(systemMiddleware.validateRequestBody(onboardingValidator.termCreation), this.create);

    this.router.route('/session').get(this.getByCurrentSession);
  }
}

export default new TermRoutes().router;
