import BaseService from '..';
import { ClassRoomSubject } from '@src/db/models';
import subjectService from './subject.service';
import classService from './class.service';
import termService from './term.service';
import { BulkClassSubjectDTO, ClassSubjectDTO } from '@src/interfaces/dto/index.dto';
import academicSessionService from './academic-session.service';
import { BadRequestError } from '@src/errors/indeex';
import moment from 'moment';

class ClassSubjectService extends BaseService<ClassRoomSubject> {
  constructor() {
    super(ClassRoomSubject, 'ClassRoom Subject');
  }

  async create(data: ClassSubjectDTO) {
    const { termId, classId, subjectId } = data;

    const isExist = await this.get({ termId, classId, subjectId });

    if (isExist) {
      throw new BadRequestError('Class subject already exist.');
    }

    await subjectService.getOrError({ id: subjectId });

    await this.runValidations(classId, termId);

    const classSubject = await this.defaultModel.create({ ...data });

    return classSubject;
  }

  async bulkCreate(data: BulkClassSubjectDTO) {
    const { termId, classId } = data;

    await this.runValidations(classId, termId);

    let creationAttributeI: Partial<ClassRoomSubject>[];

    for (const subjectId of data.subjectIds) {
      await subjectService.getOrError({ id: subjectId });

      creationAttributeI.push({ subjectId, classId, termId });
    }

    const classSubjects = await this.defaultModel.bulkCreate(creationAttributeI);

    return classSubjects;
  }

  async runValidations(classId: number, termId: number) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [classData, term] = await Promise.all([
      classService.getOrError({ id: classId }),
      termService.getOrError({ id: termId }),
    ]);

    const { academicSessionId, endDate } = term;

    const session = await academicSessionService.get({ id: academicSessionId, isCurrent: true });

    if (!session) {
      throw new BadRequestError('This term is not within the current academic session.');
    }

    const isPassed = moment().isAfter(endDate);

    if (isPassed) {
      throw new BadRequestError('You cannot enter class subjects for a term that has passed.');
    }
  }
}

export default new ClassSubjectService();
