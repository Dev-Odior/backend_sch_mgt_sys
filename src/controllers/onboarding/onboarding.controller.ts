import { serverConfig } from '@src/configs';
import { Request, Response, NextFunction } from 'express';
import { onboardingService } from '@src/services/onboarding';

export default class OnboardingController {
  public async createFormula(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body } = req;

      await onboardingService.createFormula(body);

      return res.status(200).json({
        message: 'Formula created successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in onboarding controller create formula method:${error}`);
      next(error);
    }
  }

  public async createSchool(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body } = req;

      await onboardingService.createSchool(body);

      return res.status(200).json({
        message: 'School info created successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in onboarding controller create school method:${error}`);
      next(error);
    }
  }
}
