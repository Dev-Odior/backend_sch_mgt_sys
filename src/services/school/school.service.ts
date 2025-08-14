import { School } from '@src/db/models';
import BaseService from '..';
import { Transaction } from 'sequelize';

class SchoolService extends BaseService<School> {
  constructor() {
    super(School, 'School');
  }

  async create(data: Partial<School>, transaction?: Transaction) {
    await this.defaultModel.create(data, { transaction });
  }
}

export default new SchoolService();
