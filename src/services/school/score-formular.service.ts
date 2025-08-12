import { BadRequestError } from '@src/errors/indeex';
import BaseService from '..';
import { ScoreFormula } from '@src/db/models';

class ClassService extends BaseService<ScoreFormula> {
  constructor() {
    super(ScoreFormula, 'Score Formula');
  }

  async create(data: ScoreFormula) {
    const scoreFormulaExists = await this.get({});

    if (scoreFormulaExists) {
      throw new BadRequestError('Score formula already exits, update formula instead.');
    }

    const { examScore, numberOfAssessment, scorePerAssessment } = data;

    const finalScore = examScore + numberOfAssessment * scorePerAssessment;

    if (finalScore > 100) {
      throw new BadRequestError('You formula sum cannot be more than 100.');
    }

    const formula = await this.defaultModel.create(data);

    return formula;
  }
}

export default new ClassService();
