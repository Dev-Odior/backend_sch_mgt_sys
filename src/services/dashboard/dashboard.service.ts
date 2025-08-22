import { studentService } from '../student';
import { staffService } from '../staff';
import { Activity } from '@src/db/models';
import { UserRoleEnum } from '@src/db/models/school/staff.model';
import { gradingSystemService, scoreFormularService } from '../school';

class DashboardService {
  async index() {
    // pending results

    const [
      totalStudent,
      totalTeachers,
      totalBursars,
      activities,
      totalMaleStudent,
      totalFemaleStudent,
      gradingSystem,
      scoreFormula,
    ] = await Promise.all([
      studentService.getAll({}),
      staffService.count({ role: UserRoleEnum.teacher }),
      staffService.count({ role: UserRoleEnum.bursar }),
      Activity.findAndCountAll({ where: {} }),
      studentService.count({ gender: 'male' }),
      studentService.count({ gender: 'female' }),
      gradingSystemService.getAll({}),
      scoreFormularService.get({}),
    ]);

    console.log(totalStudent.length);

    return {
      totalStudent: totalStudent.length,
      totalTeachers,
      totalBursars,
      totalMaleStudent,
      totalFemaleStudent,
      activities,
      gradingSystem,
      scoreFormula,
    };
  }
}

export default new DashboardService();
