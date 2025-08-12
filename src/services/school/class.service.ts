import BaseService from '..';
import { Class } from '@src/db/models';

class ClassService extends BaseService<Class> {
  constructor() {
    super(Class, 'Class');
  }

  async create() {}
}

export default new ClassService();
