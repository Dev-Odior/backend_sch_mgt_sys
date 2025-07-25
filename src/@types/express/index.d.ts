import { QueryOptions } from '@src/interfaces/functions.interface';
import User from '@src/db/models/user.model';

declare module 'express' {
  export interface Request {
    queryOpts?: QueryOptions;
    user?: User;
    paramIds?: {
      [key: string]: number;
    };
  }
}
