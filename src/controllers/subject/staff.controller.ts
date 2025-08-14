import { serverConfig } from '@src/configs';
import { Request, Response, NextFunction } from 'express';
import { subjectService } from '@src/services/school';

export default class SubjectController {
  public async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const data = await subjectService.getAll({});

      return res.status(200).json({
        message: 'Staff deactivated successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Staff Controller deactivate staff method:${error}`);
      next(error);
    }
  }
}
