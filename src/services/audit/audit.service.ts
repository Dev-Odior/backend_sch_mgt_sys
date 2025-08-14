import BaseService from '..';
import { Activity, Admin } from '@src/db/models';
import { ActivityTypeEnum, CreateActivityDTO } from '@src/interfaces/dto/index.dto';
import { staffService } from '../staff';
import { studentService } from '../student';
import { Transaction } from 'sequelize';
import Staff, { UserRoleEnum } from '@src/db/models/school/staff.model';
import { adminService } from '../admin';

class AuditService extends BaseService<Activity> {
  constructor() {
    super(Activity, 'Activity');
  }

  async createAudit(data: Partial<CreateActivityDTO>, transaction?: Transaction) {
    const {
      req: {
        user: { id, role },
      },
      activityOn,
      activityType,
    } = data;

    let staff: Staff | Admin;

    if (role === UserRoleEnum.admin) {
      staff = await adminService.getOrError({ id });
    } else {
      staff = await staffService.getOrError({ id });
    }

    const student = await studentService.getOrError({ id: activityOn });

    let description: string;

    switch (activityType) {
      case ActivityTypeEnum.createScore:
        description = `A score was added for ${student.firstName} ${student.surname} by ${staff.fullName}`;
        break;
      case ActivityTypeEnum.updateScore:
        description = `A score was updated for ${student.firstName} ${student.surname} by ${staff.fullName}`;
        break;
      case ActivityTypeEnum.deleteScore:
        description = `A score was deleted for ${student.firstName} ${student.surname} by ${staff.fullName}`;
        break;
      case ActivityTypeEnum.generateReceipt:
        description = `A receipt was generated for ${student.firstName} ${student.surname} by ${staff.fullName}`;
        break;
      default:
        description = `An unknown activity was performed for ${student.firstName} ${student.surname} by ${staff.fullName}`;
    }

    const creationAttributes: Partial<Activity> = {
      activityBy: id,
      activityOn,
      description,
    };

    await this.defaultModel.create(creationAttributes, { transaction });
  }
}

export default new AuditService();
