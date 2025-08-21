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

    const current = await this.get({ isCurrent: true });

    if (current) {
      throw new BadRequestError(
        `${current.name} is still active disable it, to create new session`,
      );
    }

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

  async update(id: number, data: Partial<AcademicSession>) {
    const session = await this.getOrError({ id });

    await session.update({ ...data });

    return session;
  }

  async toggle(id: number) {
    const session = await this.get({ id, isCurrent: true });

    if (!session) {
      throw new BadRequestError('Session already concluded.');
    }

    await session.update({ isCurrent: false });

    return session;
  }
}

export default new AcademicSessionService();
