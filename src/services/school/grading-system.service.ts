import { GradeSystemDTO } from '@src/interfaces/dto/index.dto';
import BaseService from '..';
import { GradeSystem } from '@src/db/models';
import { BadRequestError } from '@src/errors/indeex';
import { Op } from 'sequelize';

class GradeSystemService extends BaseService<GradeSystem> {
  constructor() {
    super(GradeSystem, 'Grade System');
  }

  async create(data: GradeSystemDTO) {
    const { grade, upperRange, lowerRange } = data;

    const gradeExit = await this.get({ grade });

    if (lowerRange >= 100 && upperRange >= 100) {
      throw new BadRequestError('You grade range cannot exceed 100.');
    }

    if (lowerRange > upperRange) {
      throw new BadRequestError('Your lower range cannot be higher than your upper range.');
    }

    if (gradeExit) {
      throw new BadRequestError('You cannot input a grade that already exists.');
    }

    const overlappingGrade = await this.defaultModel.findOne({
      where: {
        [Op.and]: [
          { upperRange: { [Op.gte]: lowerRange } },
          { lowerRange: { [Op.lte]: upperRange } },
        ],
      },
    });

    if (overlappingGrade) {
      throw new BadRequestError('The range overlaps with an existing grade.');
    }

    // Proceed to create the grade
    return this.defaultModel.create(data);
  }
}

export default new GradeSystemService();
