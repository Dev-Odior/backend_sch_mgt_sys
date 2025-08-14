import { BadRequestError } from '@src/errors/indeex';
import BaseService from '..';
import { Staff } from '@src/db/models';

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
}

export default new StaffService();
