import BaseService from '..';
import { Admin } from '@src/db/models';

class AdminService extends BaseService<Admin> {
  constructor() {
    super(Admin, 'Admin');
  }

  async create(data: Partial<Admin>) {
    await this.defaultModel.create(data);
  }
}

export default new AdminService();
