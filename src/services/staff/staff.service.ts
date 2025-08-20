import { BadRequestError } from '@src/errors/indeex';
import BaseService from '..';
import { Staff } from '@src/db/models';
import { auditService } from '../audit';
import { classService } from '../school';
import teacherSubjectService from './teacher-subject.service';

class StaffService extends BaseService<Staff> {
  constructor() {
    super(Staff, 'Staff');
  }

  async deactivateStaff(staffId: number) {
    const staff = await this.getOrError({ id: staffId });

    const { isActive } = staff;

    if (!isActive) {
      throw new BadRequestError('Staff already deactivated.');
    }

    await staff.update({ isActive: false });
  }

  async teacherDashboard(staffId: number) {
    const teacher = await this.getOrError({ id: staffId });

    const { classId } = teacher;

    // TODO: pending result

    const [subjects, classRoom, activities] = await Promise.all([
      teacherSubjectService.getAll({ staffId }, teacherSubjectService.includeables),
      classService.get({ id: classId }),
      auditService.getAll({ activityBy: staffId }),
    ]);

    let allSubjects: { name: string }[];

    if (subjects) {
      allSubjects = subjects.map((sub) => {
        const { subject } = sub;
        return { name: subject.name };
      });
    }

    return { allSubjects, classRoom, activities };
  }
}

export default new StaffService();
