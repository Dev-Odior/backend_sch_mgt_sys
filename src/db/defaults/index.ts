import adminUsers from '../../resources/defaults/adminProfiles.json';
import classes from '../../resources/defaults/class.json';
import subjects from '../../resources/defaults/subject.json';
import gradingSystems from '../../resources/defaults/gradingSystem.json';
import { Admin } from '../models';
import { adminService } from '@src/services/admin';
import { serverConfig } from '@src/configs';
import { UserRoleEnum } from '../models/school/staff.model';
import { classService, gradingSystemService, subjectService } from '@src/services/school';

export interface DefaultAdminUserDataAttributeI {
  fullName: string;
  email: string;
}

export interface DefaultClassDataAttributeI {
  name: string;
  level: string;
}

export interface DefaultSubjectDataAttributeI {
  name: string;
}

export interface DefaultGradingSystemDataAttributeI {
  grade: string;
  lowerRange: number;
  upperRange: number;
}

class DefaultData {
  constructor(
    private readonly defaultAdminUsers: DefaultAdminUserDataAttributeI[] = adminUsers,
    private readonly defaultClasses: DefaultClassDataAttributeI[] = classes,
    private readonly defaultSubject: DefaultSubjectDataAttributeI[] = subjects,
    private readonly defaultGradingSystem: DefaultGradingSystemDataAttributeI[] = gradingSystems,
  ) {}

  public async migrateDefaultAdmins() {
    this.defaultAdminUsers.forEach(async (defaultAdminUser) => {
      const password = serverConfig.DEFAULT_USER_PROFILE_PASSWORD;

      const { fullName, email } = defaultAdminUser;

      const adminAttribute: Partial<Admin> = {
        fullName,
        email,
        password,
        role: UserRoleEnum.admin,
      };

      await adminService.create(adminAttribute);
    });

    // TODO: FIX THIS MIGRATION FILE
    this.defaultClasses.forEach(async (defaultClass) => {
      await classService.create(defaultClass);
    });

    this.defaultSubject.forEach(async (subject) => {
      await subjectService.create(subject);
    });

    this.defaultGradingSystem.forEach(async (grade) => {
      await gradingSystemService.create(grade);
    });
  }
}

export default new DefaultData();
