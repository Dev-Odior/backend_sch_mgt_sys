import { BadRequestError, ConflictError } from '@src/errors/indeex';
import BaseService from '..';
import { Student, Term } from '@src/db/models';
import { PromoteStudentDTO, StudentCreationDTO } from '@src/interfaces/dto/index.dto';
import classService from '../school/class.service';
import { academicSessionService, classSubjectService } from '../school';
import { UserRoleEnum } from '@src/db/models/school/staff.model';
import moment from 'moment';

class StudentService extends BaseService<Student> {
  constructor() {
    super(Student, 'Student');
  }

  async create(data: StudentCreationDTO) {
    const { email, classId, admissionNumber } = data;

    const [isExisting, isExistingId] = await Promise.all([
      this.get({ email }),
      this.get({ admissionNumber }),
      classService.getOrError({ id: classId }),
    ]);

    if (isExistingId) {
      throw new ConflictError('Student with this admission number already exist.');
    }

    if (isExisting) {
      throw new ConflictError('Student with this email already exist.');
    }

    let student: Student;

    await this.defaultModel.sequelize.transaction(async (transaction) => {
      student = await this.defaultModel.create(
        {
          ...data,
          role: UserRoleEnum.student,
        },
        { transaction },
      );
    });

    return student;
  }

  async promoteStudent(data: PromoteStudentDTO) {
    const { studentId, classId } = data;

    const [student] = await Promise.all([
      this.getOrError({ id: studentId }),
      classService.getOrError({ id: classId }),
    ]);

    await student.update({ classId });
  }

  async studentScoreValidator(classId: number, termId: number) {
    const session = await academicSessionService.getOrError({ isCurrent: true }, [
      this.generateIncludeable(Term, 'Term'),
    ]);

    const { terms } = session;

    const currentTerm = terms.find((term) => {
      const { endDate, startDate } = term;
      return moment().isBetween(startDate, endDate);
    });

    if (!currentTerm) {
      throw new BadRequestError('There is no current term for this session, Please create one.');
    }

    const classSubjects = await classSubjectService.getAll({ classId, termId });

    if (classSubjects.length < 0) {
      throw new BadRequestError(
        'The class you selected has not been assigned subjects, please add some.',
      );
    }
  }
}

export default new StudentService();
