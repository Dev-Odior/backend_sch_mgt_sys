import { Term } from '@src/db/models';
import BaseService from '..';

class termService extends BaseService<Term> {
  constructor() {
    super(Term, 'Term');
  }
}

export default new termService();
