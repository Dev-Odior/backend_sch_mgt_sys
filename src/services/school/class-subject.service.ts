import BaseService from '..';
import { Admin, ClassRoom, ClassRoomSubject, Staff, Student, Subject, Term } from '@src/db/models';
import subjectService from './subject.service';
import classService from './class.service';
import termService from './term.service';
import { BulkClassSubjectDTO, ClassSubjectDTO } from '@src/interfaces/dto/index.dto';
import academicSessionService from './academic-session.service';
import { BadRequestError, UnauthorizedError } from '@src/errors/indeex';
import moment from 'moment';
import { UserRoleEnum } from '@src/db/models/school/staff.model';
import { staffService } from '../staff';
import { Includeable } from 'sequelize';

class ClassSubjectService extends BaseService<ClassRoomSubject> {
  constructor() {
    super(ClassRoomSubject, 'ClassRoom Subject');
  }

  includeables: Includeable[] = [
    this.generateIncludeable(Term, 'term'),
    this.generateIncludeable(ClassRoom, 'class'),
    this.generateIncludeable(Subject, 'subject'),
  ];

  async create(data: ClassSubjectDTO, user?: Student | Staff | Admin) {
    const { termId, classId, subjectId } = data;

    const isExist = await this.get({ termId, classId, subjectId });

    if (isExist) {
      throw new BadRequestError('Class subject already exist.');
    }

    await subjectService.getOrError({ id: subjectId });

    await this.runValidations(classId, termId, subjectId, user);

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

  async runValidations(
    classId: number,
    termId: number,
    subjectId?: number,
    user?: Student | Staff | Admin,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [classData, term] = await Promise.all([
      classService.getOrError({ id: classId }),
      termService.getOrError({ id: termId }),
    ]);

    const isExisting = await this.get({ classId, termId, subjectId });

    if (isExisting) {
      throw new BadRequestError('This subject already exist for this class.');
    }

    const total = await this.sum('id', {
      classId,
      termId,
    });

    if (total > 10) {
      throw new BadRequestError('Maximum amount of class subject reached.');
    }

    const { id, role } = user;

    if (role !== UserRoleEnum.admin) {
      const isAssignedToClass = await staffService.get({ classId: classData.id, id });

      if (!isAssignedToClass) {
        throw new UnauthorizedError(
          'You do not have the permission to create class subject for this class.',
        );
      }
    }

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
