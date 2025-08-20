import { serverConfig } from '@src/configs';
import { Request, Response, NextFunction } from 'express';

export default class UtilityController {
  public async te(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      return res.status(200).json({
        message: 'Emojis retrieved successfully',
        data: [],
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in utility emojis controller method: ${error}`);
      next(error);
    }
  }
}
