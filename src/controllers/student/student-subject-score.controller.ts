import { serverConfig } from '@src/configs';
import { Request, Response, NextFunction } from 'express';
import { studentScoreService } from '@src/services/student';
import { auditService } from '@src/services/audit';
import { ActivityTypeEnum, CreateActivityDTO } from '@src/interfaces/dto/index.dto';

export default class StudentSubjectScoreController {
  public async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { queryOpts } = req;
      const data = await studentScoreService.getAllPaginated(
        {},
        queryOpts,
        studentScoreService.includeables,
      );

      return res.status(200).json({
        message: 'Student subject scores retrieved successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Student Subject Score Controller create method:${error}`);

      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body } = req;

      const data = await studentScoreService.create(body, req);

      return res.status(200).json({
        message: 'Student subject score created successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Student Subject Score Controller create method:${error}`);

      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        paramIds: { id },
      } = req;

      const studentSubjectScore = await studentScoreService.getOrError({ id });

      const auditCreationAttributeI: Partial<CreateActivityDTO> = {
        req,
        activityOn: studentSubjectScore.studentId,
        activityType: ActivityTypeEnum.deleteScore,
      };

      await auditService.createAudit(auditCreationAttributeI);

      await studentSubjectScore.destroy();

      return res.status(200).json({
        message: 'Student subject score deleted successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in student subject score Controller delete method:${error}`);
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        paramIds: { studentId },
        body,
      } = req;

      const data = await studentScoreService.update(studentId, body, req);

      return res.status(200).json({
        message: 'Student subject score deleted successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in student subject score Controller delete method:${error}`);
      next(error);
    }
  }

  public async lastScore(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        paramIds: { studentId },
      } = req;

      console.log('this was hit');

      const data = await studentScoreService.get({ studentId }, [], [['createdAt', 'DESC']]);

      return res.status(200).json({
        message: 'Student last subject score successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in student subject score Controller last score method:${error}`);
      next(error);
    }
  }
}
