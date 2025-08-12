import { ConflictError } from '@src/errors/indeex';
import BaseService from '..';
import { Student } from '@src/db/models';
import { StudentCreationDTO } from '@src/interfaces/dto/index.dto';
import classService from '../school/class.service';

class StudentService extends BaseService<Student> {
  constructor() {
    super(Student, 'Student');
  }

  async create(data: StudentCreationDTO) {
    const { email, classId } = data;

    const isExisting = await this.get({ email });

    await classService.getOrError({ id: classId });

    if (isExisting) {
      throw new ConflictError('Student with this email already exist.');
    }

    const student: Student = await this.defaultModel.create(data);

    return student;
  }
}

export default new StudentService();
