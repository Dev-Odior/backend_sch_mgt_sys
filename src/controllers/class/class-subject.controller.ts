import { serverConfig } from '@src/configs';
import { Request, Response, NextFunction } from 'express';
import { classSubjectService } from '@src/services/school';
import { staffService } from '@src/services/staff';
import { UnauthorizedError } from '@src/errors/indeex';

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
      const { body, user } = req;

      const data = await classSubjectService.create(body, user);

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

  public async getByTeacherId(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { user } = req;

      const { id } = user;

      const staff = await staffService.getOrError({ id });

      const data = await classSubjectService.getAll(
        {
          classId: staff.classId,
        },
        classSubjectService.includeables,
      );

      return res.status(200).json({
        message: 'Class subjects retrieved successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in class subject service controller get by teacher id:${error}`);
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        paramIds: { classSubjectId },
        user,
      } = req;

      const { id } = user;

      const staff = await staffService.getOrError({ id });

      const subject = await classSubjectService.get({
        id: classSubjectId,
        classId: staff.classId,
      });

      if (!subject) {
        throw new UnauthorizedError('You do not have the permission to delete this class subject.');
      }

      await subject.destroy();

      return res.status(200).json({
        message: 'Class subjects retrieved successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in class subject service controller delete method:${error}`);
      next(error);
    }
  }
}
