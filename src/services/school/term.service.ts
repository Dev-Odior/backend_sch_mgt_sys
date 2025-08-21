import BaseService from '..';
import { Term } from '@src/db/models';
import { Transaction } from 'sequelize';
import academicSessionService from './academic-session.service';
import { BadRequestError } from '@src/errors/indeex';
import moment from 'moment';

class TermService extends BaseService<Term> {
  constructor() {
    super(Term, 'Term');
  }

  async create(data: Partial<Term>, transaction?: Transaction) {
    const { academicSessionId } = data;

    const academicSession = await academicSessionService.getOrError({ id: academicSessionId });

    if (!academicSession.isCurrent) {
      throw new BadRequestError('Please enter the current academic session.');
    }

    const terms = await this.sum('id', { academicSessionId });

    console.log(terms, academicSession.numberOfTerms);

    if (terms === academicSession.numberOfTerms) {
      throw new BadRequestError(
        'You have reach the maximum number of term for the current academic session.',
      );
    }

    if (moment().isAfter(data.startDate) || moment().isAfter(data.endDate)) {
      throw new BadRequestError('You cannot have dates in the past');
    }

    if (moment(data.endDate).isBefore(data.startDate)) {
      throw new BadRequestError('You cannot have you term end date before start date.');
    }

    const term = await this.defaultModel.create({ ...data }, { transaction });

    return term;
  }
}

export default new TermService();
