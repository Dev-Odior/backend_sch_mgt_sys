import { Request } from 'express';
import { ValidationResult } from 'joi';

export interface QueryOptions {
  limit: number;
  offset: number;
  search: string;
}

export type RequestValidator = (req: Request) => ValidationResult;
