import { serverConfig } from '@src/configs';
import { Request, Response, NextFunction } from 'express';
import { studentReportService } from '@src/services/student';

export default class StudentReportController {
  public async generateReport(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        paramIds: { termId, classId, studentId },
      } = req;

      const data = await studentReportService.generate({ termId, classId, studentId });

      return res.status(200).json({
        message: 'Student report retrieved successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Student Report Controller generate report method:${error}`);

      next(error);
    }
  }
}
