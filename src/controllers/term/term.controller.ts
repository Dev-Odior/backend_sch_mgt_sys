import { serverConfig } from '@src/configs';
import { termService } from '@src/services/school';
import { Request, Response, NextFunction } from 'express';
import { academicSessionService } from '@src/services/school';

export default class TermController {
  public async getByCurrentSession(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const session = await academicSessionService.getOrError({ isCurrent: true });

      const data = await termService.getAll({ academicSessionId: session.id });

      return res.status(200).json({
        message: 'Term by academic session retrieved successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in term controller index method:${error}`);
      next(error);
    }
  }

  public async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const data = await termService.getAll({});

      return res.status(200).json({
        message: 'Terms retrieved successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in term controller index method:${error}`);
      next(error);
    }
  }
}
