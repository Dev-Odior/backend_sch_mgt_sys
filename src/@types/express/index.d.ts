import { QueryOptions } from '@src/interfaces/functions.interface';
import { Admin, Student, Staff } from '@src/db/models';

declare module 'express' {
  export interface Request {
    queryOpts?: QueryOptions;
    user?: Student | Staff | Admin;
    paramIds?: {
      [key: string]: number;
    };
  }
}
