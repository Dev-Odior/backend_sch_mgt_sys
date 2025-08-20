import { serverConfig } from '@src/configs';
import { Request, Response, NextFunction } from 'express';
import { staffService } from '@src/services/staff';

export default class StaffController {
  public async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { queryOpts } = req;

      const data = await staffService.getAllPaginated({}, queryOpts);

      return res.status(200).json({
        message: 'Staffs retrieved successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Staff controller index method:${error}`);
      next(error);
    }
  }

  public async deactivateStaff(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        paramIds: { staffId },
      } = req;

      await staffService.deactivateStaff(staffId);

      return res.status(200).json({
        message: 'Staff deactivated successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Staff Controller deactivate staff method:${error}`);
      next(error);
    }
  }

  public async assignRole(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      return res.status(200).json({
        message: 'Staff Role Assigned successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Staff Controller assign role method:${error}`);
      next(error);
    }
  }

  public async teacherDashboardInfo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const {
        paramIds: { staffId },
      } = req;

      const data = await staffService.teacherDashboard(staffId);

      return res.status(200).json({
        message: 'Teacher Dashboard retrieved successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Staff Controller assign role method:${error}`);
      next(error);
    }
  }
}
