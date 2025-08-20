import { serverConfig } from '@src/configs';
import { Request, Response, NextFunction } from 'express';
import { gradingSystemService } from '@src/services/school';

export default class GradeSystemController {
  public async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const data = await gradingSystemService.getAll({});

      return res.status(200).json({
        message: 'Grade System retrieved successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Grade System controller index method:${error}`);
      next(error);
    }
  }
}
