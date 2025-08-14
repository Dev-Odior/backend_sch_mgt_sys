import { serverConfig } from '@src/configs';
import { Request, Response, NextFunction } from 'express';
import { classSubjectService } from '@src/services/school';

export default class ClassSubjectServiceController {
  public async bulkCreate(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body } = req;

      await classSubjectService.bulkCreate(body);

      return res.status(200).json({
        message: 'Class subjects created successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(
        `Error in class subject service controller staff bulk create method:${error}`,
      );
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body } = req;

      const data = await classSubjectService.create(body);

      return res.status(200).json({
        message: 'Class subject created successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in class subject service controller create method:${error}`);
      next(error);
    }
  }

  public async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        params: { classId, termId },
      } = req;

      const data = await classSubjectService.getAll({ classId, termId });

      return res.status(200).json({
        message: 'Class subjects retrieved successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in class subject service controller index:${error}`);
      next(error);
    }
  }
}
