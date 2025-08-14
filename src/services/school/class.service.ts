import BaseService from '..';
import { ClassRoom } from '@src/db/models';

class ClassService extends BaseService<ClassRoom> {
  constructor() {
    super(ClassRoom, 'Class');
  }

  async create(data: Partial<ClassRoom>) {
    const { name, level } = data;

    await this.defaultModel.findOrCreate({
      where: { name, level },
      defaults: { ...data },
    });
  }
}

export default new ClassService();
