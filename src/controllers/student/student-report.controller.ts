import { serverConfig } from '@src/configs';
import { Request, Response, NextFunction } from 'express';
import { studentReportService } from '@src/services/student';

export default class StudentReportController {
  public async generateReport(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body } = req;

      const data = await studentReportService.generate(body);

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
