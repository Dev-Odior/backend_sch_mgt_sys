import { CreateAcademicSessionDTO } from '@src/interfaces/dto/index.dto';
import BaseService from '..';
import { AcademicSession } from '@src/db/models';
import { BadRequestError } from '@src/errors/indeex';
import { Op } from 'sequelize';

class AcademicSessionService extends BaseService<AcademicSession> {
  constructor() {
    super(AcademicSession, 'Academic Session');
  }

  async create(data: CreateAcademicSessionDTO) {
    const { name, startDate, endDate } = data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const existing = await this.defaultModel.findOne({ where: { name } });

    if (existing) {
      throw new BadRequestError(`An academic session with the name "${name}" already exists.`);
    }

    const overlapping = await this.defaultModel.findOne({
      where: {
        [Op.or]: [
          {
            startDate: { [Op.between]: [start, end] },
          },
          {
            endDate: { [Op.between]: [start, end] },
          },
          {
            startDate: { [Op.lte]: start },
            endDate: { [Op.gte]: end },
          },
        ],
      },
    });

    if (overlapping) {
      throw new BadRequestError('The session overlaps with an existing academic session.');
    }

    const session = await this.defaultModel.create({
      name,
      startDate: start,
      endDate: end,
      isCurrent: true,
    });

    return session;
  }
}

export default new AcademicSessionService();
