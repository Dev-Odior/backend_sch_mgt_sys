import { serverConfig } from '@src/configs';
import dashboardService from '@src/services/dashboard/dashboard.service';
import { Request, Response, NextFunction } from 'express';

export default class DashboardController {
  public async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const data = await dashboardService.index();

      return res.status(200).json({
        message: 'Dashboard retrieved created successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in dashboard controller index method:${error}`);
      next(error);
    }
  }
}
