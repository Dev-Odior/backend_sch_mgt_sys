import BaseService from '..';
import { AcademicSession } from '@src/db/models';
import { BadRequestError } from '@src/errors/indeex';
import { Transaction } from 'sequelize';

class AcademicSessionService extends BaseService<AcademicSession> {
  constructor() {
    super(AcademicSession, 'Academic Session');
  }

  async create(data: Partial<AcademicSession>, transaction?: Transaction) {
    const { name } = data;

    const existing = await this.defaultModel.findOne({ where: { name } });

    if (existing) {
      throw new BadRequestError(`An academic session with the name "${name}" already exists.`);
    }

    const session = await this.defaultModel.create(
      {
        name,
        isCurrent: true,
      },
      { transaction },
    );

    return session;
  }
}

export default new AcademicSessionService();
