import { serverConfig } from '@src/configs';
import { Request, Response, NextFunction } from 'express';
import { classService } from '@src/services/school';

export default class ClassController {
  public async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const data = await classService.getAll({});

      return res.status(200).json({
        message: 'Classes retrieved successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in class controller index method:${error}`);
      next(error);
    }
  }
}
