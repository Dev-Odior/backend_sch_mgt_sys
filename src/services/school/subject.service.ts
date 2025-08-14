import BaseService from '..';
import { Subject } from '@src/db/models';

class SubjectService extends BaseService<Subject> {
  constructor() {
    super(Subject, 'Subject');
  }

  async create(data: Partial<Subject>) {
    const { name } = data;
    await this.defaultModel.findOrCreate({ where: { name }, defaults: { ...data } });
  }
}

export default new SubjectService();
