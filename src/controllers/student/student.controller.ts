import { serverConfig } from '@src/configs';
import { Request, Response, NextFunction } from 'express';
import { studentService } from '@src/services/student';

export default class StudentController {
  public async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const data = await studentService.getAll({});

      return res.status(200).json({
        message: 'Students retrieved successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Student Controller index method:${error}`);

      next(error);
    }
  }

  public async promoteStudent(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body } = req;

      const data = await studentService.promoteStudent(body);

      return res.status(200).json({
        message: 'Student promoted successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Student Controller promote student method:${error}`);

      next(error);
    }
  }

  public async get(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        paramIds: { studentId },
      } = req;

      const data = await studentService.getOrError({ id: studentId });

      return res.status(200).json({
        message: 'Student deleted successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in student Controller delete student method:${error}`);
      next(error);
    }
  }

  public async deleteStudent(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        paramIds: { studentId },
      } = req;

      await studentService.deleteOrError({ id: studentId });

      return res.status(200).json({
        message: 'Student deleted successfully.',
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in student Controller delete student method:${error}`);
      next(error);
    }
  }
}
