import { BadRequestError } from '@src/errors/indeex';
import BaseService from '..';
import { ScoreFormula } from '@src/db/models';

class ClassService extends BaseService<ScoreFormula> {
  constructor() {
    super(ScoreFormula, 'Score Formula');
  }

  async create(data: Partial<ScoreFormula>) {
    const scoreFormulaExists = await this.get({});

    if (scoreFormulaExists) {
      throw new BadRequestError('Score formula already exits, update formula instead.');
    }

    const { examScore, assessmentScore } = data;

    const finalScore = examScore + assessmentScore;

    if (finalScore > 100) {
      throw new BadRequestError('You formula sum cannot be more than 100.');
    }

    const formula = await this.defaultModel.create(data);

    return formula;
  }
}

export default new ClassService();
