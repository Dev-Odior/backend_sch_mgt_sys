import BaseService from '..';
import { Admin } from '@src/db/models';

class AdminService extends BaseService<Admin> {
  constructor() {
    super(Admin, 'Admin');
  }

  async create(data: Partial<Admin>) {
    const { email } = data;
    await this.defaultModel.findOrCreate({
      where: {
        email,
      },
      defaults: { ...data },
    });
  }
}

export default new AdminService();
