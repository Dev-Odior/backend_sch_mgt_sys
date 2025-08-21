import { serverConfig } from '@src/configs';
import { Request, Response, NextFunction } from 'express';
import { academicSessionService } from '@src/services/school';

export default class AcademicSessionController {
  public async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body } = req;

      const data = await academicSessionService.create(body);

      return res.status(200).json({
        message: 'Academic Session retrieved successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in academic session controller create method:${error}`);
      next(error);
    }
  }

  public async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { queryOpts } = req;

      const data = await academicSessionService.getAllPaginated({}, queryOpts);

      return res.status(200).json({
        message: 'Academic Session retrieved successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in academic session controller index method:${error}`);
      next(error);
    }
  }

  public async toggleActive(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        paramIds: { id },
      } = req;

      const data = await academicSessionService.toggle(Number(id));

      return res.status(200).json({
        message: 'Academic Session retrieved successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in academic session controller toggle active method:${error}`);
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        paramIds: { id },
      } = req;

      const data = await academicSessionService.delete({ id });

      return res.status(200).json({
        message: 'Academic Session deleted successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in academic session controller delete method:${error}`);
      next(error);
    }
  }
}
