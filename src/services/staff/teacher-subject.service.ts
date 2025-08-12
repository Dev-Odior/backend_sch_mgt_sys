import { Transaction } from 'sequelize';
import BaseService from '..';
import { TeacherSubject } from '@src/db/models';

class TeacherSubjectService extends BaseService<TeacherSubject> {
  constructor() {
    super(TeacherSubject, 'Teacher Subject');
  }

  async bulkCreate(staffId: number, subjectIds: number[], transaction?: Transaction) {
    const creationAttributes = subjectIds.map((id) => {
      return { staffId, subjectId: id };
    });

    await this.defaultModel.bulkCreate(creationAttributes, { transaction });
  }
}

export default new TeacherSubjectService();
