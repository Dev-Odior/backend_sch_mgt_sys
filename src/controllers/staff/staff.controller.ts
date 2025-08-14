import { serverConfig } from '@src/configs';
import { Request, Response, NextFunction } from 'express';
import { staffService } from '@src/services/staff';

export default class StaffController {
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
}
