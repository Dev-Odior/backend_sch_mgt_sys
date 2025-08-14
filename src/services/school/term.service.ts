import BaseService from '..';
import { Term } from '@src/db/models';
import { Transaction } from 'sequelize';

class TermService extends BaseService<Term> {
  constructor() {
    super(Term, 'Term');
  }

  async create(data: Partial<Term>, transaction?: Transaction) {
    // All checks passed — create the term
    const term = await Term.create({ ...data }, { transaction });
    return term;
  }
}

export default new TermService();
