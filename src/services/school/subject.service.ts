import BaseService from '..';
import { Subject } from '@src/db/models';

class SubjectService extends BaseService<Subject> {
  constructor() {
    super(Subject, 'Subject');
  }

  async create() {}
}

export default new SubjectService();
