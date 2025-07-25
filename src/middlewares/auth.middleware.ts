import { Request, Response, NextFunction } from 'express';
import serverConfig from '@src/configs/server.config';
import { BadRequestError, ForbiddenError, UnauthorizedError } from '@src/errors';
import authenticateService from '@src/services/auth/auth.service';
import userService from '@src/services/user.service';

class AuthenticationMiddleware {
  public async validateUserAccess(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { authorization } = req.headers;

      if (!authorization) throw new BadRequestError('No token provided.');

      let token: string;
      if (authorization.startsWith('Bearer ')) {
        [, token] = authorization.split(' ');
      } else {
        token = authorization;
      }

      if (!token) throw new BadRequestError('No token provided.');

      const { payload, expired } = authenticateService.verifyToken(token);

      if (expired) throw new UnauthorizedError('Please provide a valid token.');

      const { id: userId } = payload;

      req.user = await userService.get(userId);

      return next();
    } catch (error) {
      serverConfig.DEBUG(
        `Error in authentication middleware validate user access method: ${error}`,
      );
      next(error);
    }
  }

  public validateAdminAccess(req: Request, res: Response, next: NextFunction): void {
    try {
      const { user } = req;

      if (!user || !user.isAdmin) {
        throw new ForbiddenError(`Access denied.`);
      }

      next();
    } catch (error) {
      serverConfig.DEBUG(`Error in validateUserType middleware: ${error}`);
      next(error);
    }
  }
}

export default new AuthenticationMiddleware();
