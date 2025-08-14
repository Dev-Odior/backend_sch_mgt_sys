import { serverConfig } from '@src/configs';
import { authService } from '@src/services/auth';
import { Request, Response, NextFunction } from 'express';

export default class AuthController {
  public async login(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body } = req;

      const loginData = await authService.getUserForLogin(body);
      const data = await authService.login(loginData);

      return res.status(200).json({
        message: 'Login Successful.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Auth Controller login method:${error}`);
      next(error);
    }
  }
  q;

  public async loginUsers(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body } = req;

      const loginData = await authService.getUserForLogin(body);

      const data = await authService.login(loginData);

      return res.status(200).json({
        message: 'Login Successful.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Auth Controller login method:${error}`);
      next(error);
    }
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body } = req;

      const data = await authService.register(body);

      return res.status(200).json({
        message: 'Staff Registered Successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Auth Controller register method:${error}`);
      next(error);
    }
  }

  public async registerStudent(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body } = req;

      const data = await authService.registerStudent(body);

      return res.status(200).json({
        message: 'Student Registered Successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Auth Controller register method:${error}`);
      next(error);
    }
  }

  public async changePassword(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { body, user } = req;

      const data = await authService.changePassword(user, body);

      return res.status(200).json({
        message: 'Password Changed Successfully.',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in Auth Controller change password method:${error}`);
      next(error);
    }
  }
}
