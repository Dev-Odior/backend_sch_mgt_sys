import { Request, Response, NextFunction } from 'express';
import serverConfig from '@src/configs/server.config';
import authenticateService from '@src/services/auth/auth.service';
import { BadRequestError, ForbiddenError, UnauthorizedError } from '@src/errors/indeex';
import Staff, { UserRoleEnum } from '@src/db/models/school/staff.model';
import { Admin, Student } from '@src/db/models';
import { adminService } from '@src/services/admin';
import { studentService } from '@src/services/student';
import { staffService } from '@src/services/staff';

class AuthenticationMiddleware {
  public async validateUserAccess(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { authorization } = req.headers;

      console.log(authorization);

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

      const { id, role } = payload;

      let user: Staff | Admin | Student;

      switch (role) {
        case UserRoleEnum.admin:
          user = await adminService.get({ id, role });
          break;

        // You can add more cases here
        case UserRoleEnum.teacher:
          // code for regular user
          user = await staffService.get({ id, role });
          break;

        // You can add more cases here
        case UserRoleEnum.student:
          // code for regular user
          user = await studentService.get({ id, role });
          break;

        default:
          // code for unknown role
          throw new BadRequestError('User does not have any role.');
          break;
      }

      req.user = user;

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

      if (!user || user.role !== UserRoleEnum.admin) {
        throw new ForbiddenError(`Access denied.`);
      }

      next();
    } catch (error) {
      serverConfig.DEBUG(`Error in validateUserType middleware: ${error}`);
      next(error);
    }
  }

  public validateAdminTeacherAccess(req: Request, res: Response, next: NextFunction): void {
    try {
      const { user } = req;

      if (!user || (user.role !== UserRoleEnum.admin && user.role !== UserRoleEnum.teacher)) {
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
