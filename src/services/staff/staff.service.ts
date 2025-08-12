import BaseService from '..';
import { Staff } from '@src/db/models';

class StaffService extends BaseService<Staff> {
  constructor() {
    super(Staff, 'Staff');
  }
}

export default new StaffService();
