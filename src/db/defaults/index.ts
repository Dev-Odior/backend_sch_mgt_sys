import adminUsers from '../../resources/defaults/adminProfiles.json';
import { Admin } from '../models';
import { adminService } from '@src/services/admin';
import { serverConfig } from '@src/configs';
import { UserRoleEnum } from '../models/school/staff.model';

export interface DefaultAdminUserDataAttributeI {
  fullName: string;
  email: string;
}

class DefaultData {
  constructor(private readonly defaultAdminUsers: DefaultAdminUserDataAttributeI[] = adminUsers) {}

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
  }
}

export default new DefaultData();
