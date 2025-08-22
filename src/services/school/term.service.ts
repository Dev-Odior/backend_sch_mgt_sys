import BaseService from '..';
import { AcademicSession, Term } from '@src/db/models';
import { Includeable, Op, Transaction } from 'sequelize';
import academicSessionService from './academic-session.service';
import { BadRequestError } from '@src/errors/indeex';
import moment from 'moment';

class TermService extends BaseService<Term> {
  constructor() {
    super(Term, 'Term');
  }

  includeables: Includeable[] = [this.generateIncludeable(AcademicSession, 'academicSession')];

  async create(data: Partial<Term>, transaction?: Transaction) {
    const { academicSessionId } = data;

    const academicSession = await academicSessionService.getOrError({ id: academicSessionId });

    if (!academicSession.isCurrent) {
      throw new BadRequestError('Please enter the current academic session.');
    }

    const terms = await this.count({ academicSessionId });

    if (terms === academicSession.numberOfTerms) {
      throw new BadRequestError(
        'You have reach the maximum number of term for the current academic session.',
      );
    }

    if (moment().isAfter(data.endDate)) {
      throw new BadRequestError('You term cannot end in the past');
    }

    if (moment(data.endDate).isBefore(data.startDate)) {
      throw new BadRequestError('You cannot have you term end date before start date.');
    }

    const overlappingTerm = await this.defaultModel.findOne({
      where: {
        academicSessionId,
        [Op.and]: [
          { startDate: { [Op.lte]: data.endDate } }, // existing starts before new ends
          { endDate: { [Op.gte]: data.startDate } }, // existing ends after new starts
        ],
      },
    });

    if (overlappingTerm) {
      throw new BadRequestError('This term overlaps with another existing term.');
    }

    const updatedName = `${data.name} (${academicSession.name})`;

    const term = await this.defaultModel.create({ ...data, name: updatedName }, { transaction });

    return term;
  }
}

export default new TermService();
