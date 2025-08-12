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
} from '@src/interfaces/dto/index.dto';
import { UserRoleEnum } from '@src/db/models/school/staff.model';
import teachSubjectService from '../staff/teacher-subject.service';
import { BadRequestError, ConflictError } from '@src/errors/indeex';
import classService from '../school/class.service';

class AuthService extends BaseService<Staff> {
  constructor() {
    super(Staff, 'Staff');
  }

  private AuthEncryptKey = fs.readFileSync(path.join(process.cwd(), 'private.key')).toString();
  private AuthDecryptKey = fs.readFileSync(path.join(process.cwd(), 'public.key')).toString();

  // This function registers a new staff
  public async register(data: StaffCreationDTO) {
    const { email, subjectIds } = data;

    const isExisting = await staffService.get({ email });

    if (isExisting) {
      throw new ConflictError('Teacher with this email already exist.');
    }

    await this.runStaffValidations(data);

    let staff: Staff;

    await this.defaultModel.sequelize.transaction(async (transaction) => {
      staff = await this.defaultModel.create(data, { transaction });

      await teachSubjectService.bulkCreate(staff.id, subjectIds, transaction);
    });

    const loginData = await this.login(staff);

    return loginData;
  }

  // This function registers students
  public async registerStudent(data: StudentCreationDTO) {
    const student: Student = await studentService.create(data);

    const loginData = await this.login(student);
    return loginData;
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

  public async getUserForLogin(email: string, password: string, role: UserRoleEnum) {
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
      const payload = jwt.verify(token, this.AuthDecryptKey) as unknown as Student | Staff | Admin;
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

    await classService.getOrError({ id: classId });

    if (role === UserRoleEnum.teacher) {
      const subjects = await teachSubjectService.getAll({
        id: subjectIds,
      });

      if (subjects.length !== subjectIds.length) {
        throw new BadRequestError('Some of the subjects you have entered is not valid');
      }
    }
  }
}

export default new AuthService();
