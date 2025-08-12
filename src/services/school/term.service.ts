import { TermDTO } from '@src/interfaces/dto/index.dto';
import BaseService from '..';
import { Term } from '@src/db/models';
import { Op } from 'sequelize';

class TermService extends BaseService<Term> {
  constructor() {
    super(Term, 'Term');
  }

  async create(data: TermDTO) {
    const { startDate, endDate, name } = data;
    const today = new Date();

    const activeTerm = await this.defaultModel.findOne({
      where: {
        startDate: { [Op.lte]: today },
        endDate: { [Op.gte]: today },
      },
    });

    if (activeTerm) {
      throw new Error('A term is currently running. Cannot create a new term.');
    }

    const overlappingTerm = await Term.findOne({
      where: {
        [Op.or]: [
          {
            startDate: { [Op.lte]: startDate },
            endDate: { [Op.gte]: startDate },
          },
          {
            startDate: { [Op.lte]: endDate },
            endDate: { [Op.gte]: endDate },
          },
          {
            startDate: { [Op.gte]: startDate },
            endDate: { [Op.lte]: endDate },
          },
        ],
      },
    });

    if (overlappingTerm) {
      throw new Error('The term dates overlap with an existing term.');
    }

    // All checks passed — create the term
    const term = await Term.create({ startDate, endDate, name });
    return term;
  }
}

export default new TermService();
