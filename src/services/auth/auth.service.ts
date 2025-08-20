import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@src/interfaces/auth.interface';
// import mailUtil from '@src/utils/mail.util';
import authConfig from '@src/configs/auth.config';
import BaseService from '..';
import { Admin, Staff, Student } from '@src/db/models';
import { staffService } from '../staff';
import { studentService } from '../student';
import { adminService } from '../admin';
import {
  ChangePasswordDTO,
  StaffCreationDTO,
  StudentCreationDTO,
  UserForLoginDTO,
} from '@src/interfaces/dto/index.dto';
import { UserRoleEnum } from '@src/db/models/school/staff.model';
import teachSubjectService from '../staff/teacher-subject.service';
import { BadRequestError, ConflictError, UnauthorizedError } from '@src/errors/indeex';
import classService from '../school/class.service';
import { subjectService } from '../school';
import mailUtil from '@src/utils/mail.util';

class AuthService extends BaseService<Staff> {
  constructor() {
    super(Staff, 'Staff');
  }

  private AuthEncryptKey = fs.readFileSync(path.join(process.cwd(), 'private.key')).toString();
  // private AuthDecryptKey = fs.readFileSync(path.join(process.cwd(), 'public.key')).toString();

  // This function registers a new staff
  public async register(data: StaffCreationDTO) {
    const { email } = data;

    const [isExisting] = await Promise.all([staffService.get({ email })]);

    if (isExisting) {
      throw new ConflictError('Staff with this email already exist.');
    }

    await this.runStaffValidations(data);

    let staff: Staff;

    await this.defaultModel.sequelize.transaction(async (transaction) => {
      staff = await this.defaultModel.create(data, { transaction });

      if (data.subjectIds) {
        await teachSubjectService.bulkCreate(staff.id, data.subjectIds, transaction);
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...staffData } = staff.toJSON();

    const classRoom = await classService.getOrError({ id: staff.classId });

    const mailAttributes = {
      name: staff.fullName,
      email: staff.email,
      password: data.password,
      className: classRoom.name,
    };

    await mailUtil.sendTeacherRegistrationMail(mailAttributes);

    return staffData;
  }

  // This function registers students
  public async registerStudent(data: StudentCreationDTO) {
    const student: Student = await studentService.create(data);

    const mailAttributes = {
      name: student.firstName,
      email: student.email,
      password: data.password,
    };

    await mailUtil.sendStudentRegistrationMail(mailAttributes);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...studentData } = student.toJSON();

    return studentData;
  }

  // This function login Admin
  public async loginAdmin(data: Partial<Admin>) {
    const admin: Admin = await adminService.getOrError(data);
    const loginData = await this.login(admin);
    return loginData;
  }

  // This function login Everybody
  public async login<T extends Student | Staff | Admin>(data: T) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = data.toJSON() as T;

    const payloadUser = userWithoutPassword as T;
    const accessToken = this.generateAccessToken(payloadUser);

    return { user: userWithoutPassword, accessToken };
  }

  // This function generates
  private generateAccessToken<T extends Student | Staff | Admin>(payload: T): string {
    const accessToken = jwt.sign({ ...payload }, this.AuthEncryptKey, {
      algorithm: 'RS256',
      expiresIn: authConfig.ACCESS_TOKEN_EXPIRES_IN,
    });

    return accessToken;
  }

  public validatePassword<T extends Student | Staff | Admin>(user: T, password: string): boolean {
    try {
      return bcrypt.compareSync(password, user.password);
    } catch (error) {
      throw new BadRequestError('Error validating password at the moment');
    }
  }

  public async getUserForLogin({ role, email, password }: UserForLoginDTO) {
    let data: Student | Staff | Admin | null = null;

    if (role === UserRoleEnum.admin) {
      data = await Admin.scope('withPassword').findOne({
        where: { email },
      });
    }

    if (role === UserRoleEnum.teacher) {
      data = await this.defaultModel.scope('withPassword').findOne({
        where: { email },
      });

      if (!data.isActive) {
        throw new UnauthorizedError(
          'You are not allowed to access this application, contact administrator.',
        );
      }
    }

    if (role === UserRoleEnum.student) {
      data = await Student.scope('withPassword').findOne({ where: { email } });
    }

    if (!data || !this.validatePassword(data, password)) {
      throw new ConflictError('Email or password is incorrect.');
    }

    return data;
  }

  public verifyToken(token: string): DecodedToken {
    try {
      const payload = jwt.verify(token, this.AuthEncryptKey) as unknown as Student | Staff | Admin;

      return {
        payload,
        expired: false,
      };
    } catch (error) {
      return {
        payload: null,
        expired: error.message.includes('expired') ? error.message : error,
      };
    }
  }

  // public async forgotPassword(email: string, req: Request): Promise<User> {
  //   const user = await this.UserModel.findOne({ where: { email } });

  //   if (!user) {
  //     throw new NotFoundError(`Admin user with email '${email}' does not exist.`);
  //   }

  //   // await mailUtil.sendForgotPasswordMail(user, operatingSystem, browserName);
  //   return user;
  // }

  // This function would change the password
  public async changePassword<T extends Student | Staff | Admin>(
    modelInfo: T,
    changePassword: ChangePasswordDTO,
  ) {
    const { email, role, id } = modelInfo;
    const { currentPassword, newPassword, confirmNewPassword } = changePassword;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestError('You password to be updated too are not matching.');
    }

    if (role === UserRoleEnum.student) {
      const student = await Student.scope('withPassword').findOne({
        where: { id, email },
      });

      const validatePassword = this.validatePassword(student, currentPassword);

      if (!validatePassword) {
        throw new BadRequestError('You have entered an incorrect password.');
      }

      student.update({ password: newPassword });
    }

    if (role === UserRoleEnum.teacher) {
      const teacher = await Staff.scope('withPassword').findOne({
        where: { id, email, role: UserRoleEnum.teacher },
      });

      const validatePassword = this.validatePassword(teacher, currentPassword);

      if (!validatePassword) {
        throw new BadRequestError('You have entered an incorrect password.');
      }

      teacher.update({ password: newPassword });
    }
  }

  // This function would run validations
  private async runStaffValidations(data: StaffCreationDTO) {
    const { role, subjectIds, classId } = data;

    const classRoom = await classService.get({ id: classId });

    if (!classRoom) {
      throw new BadRequestError('Class room does not exit create some.');
    }

    if (role === UserRoleEnum.teacher) {
      const subjects = await subjectService.getAll({
        id: subjectIds,
      });

      if (subjects.length !== subjectIds.length) {
        throw new BadRequestError('You have entered subjects that do not exist within the school');
      }
    }
  }
}

export default new AuthService();
