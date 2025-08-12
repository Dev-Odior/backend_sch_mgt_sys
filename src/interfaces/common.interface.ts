export interface ReqQueryOptions {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  type?: string;
  sortOrder?: 'ASC' | 'DESC';
  id?: number;
  countryId?: number;
  stateId?: number;
  year?: string;
}

export interface PaginatedResponse<T> {
  result: T[];
  totalCount: number;
}

export interface BaseAttributeI {
  readonly id: number;
  readonly companyId: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export enum RedisOption {
  PERMISSIONS = 'permissions',
}

export enum CsvFileParseType {
  APPRAISAL_CYCLE_EMPLOYEES = 'appraisal_cycle_employees',
}
