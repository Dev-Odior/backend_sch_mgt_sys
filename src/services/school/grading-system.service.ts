import BaseService from '..';
import { GradeSystem } from '@src/db/models';

class GradeSystemService extends BaseService<GradeSystem> {
  constructor() {
    super(GradeSystem, 'Grade System');
  }

  async create(data: Partial<GradeSystem>) {
    const { grade, upperRange, lowerRange } = data;

    return this.defaultModel.findOrCreate({
      where: { grade, upperRange, lowerRange },
      defaults: { ...data },
    });
  }
}

export default new GradeSystemService();
