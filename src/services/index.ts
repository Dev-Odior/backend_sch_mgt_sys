import {
  FindAttributeOptions,
  FindOptions,
  GroupOption,
  Includeable,
  Model,
  ModelStatic,
  OrderItem,
  Transaction,
  WhereOptions,
} from 'sequelize';

import { BadRequestError, NotFoundError, UnprocessableEntityError } from '@src/errors/indeex';
import { PaginatedResponse, ReqQueryOptions } from '@src/interfaces/common.interface';

class BaseService<T extends Model> {
  protected defaultModel: ModelStatic<T> = null;

  constructor(
    private model: ModelStatic<T>,
    private name: string,
  ) {
    this.defaultModel = model;
  }

  async getAll(
    whereQuery: WhereOptions<T>,
    includeables?: Includeable[],
    limit?: number,
    order?: OrderItem[],
    attributes?: FindAttributeOptions,
    group?: GroupOption,
  ): Promise<T[]> {
    const query: FindOptions<T> = {
      where: whereQuery,
      include: includeables,
    };

    if (limit) {
      query.limit = limit;
    }

    if (order) {
      query.order = order;
    }

    if (attributes) {
      query.attributes = attributes;
    }

    if (group) {
      query.group = group;
    }

    const records: T[] = await this.model.findAll(query);

    return records;
  }

  async getAllForAnalytic(
    whereQuery: WhereOptions<T>,
    attributes?: FindAttributeOptions,
    includeables?: Includeable[],
    group?: GroupOption,
    order?: OrderItem[],
    raw?: boolean,
    nest?: boolean,
    limit?: number,
  ): Promise<T[]> {
    const query: FindOptions<T> = {
      where: whereQuery,
      attributes,
      include: includeables,
      group,
      order,
      raw,
      nest,
      limit,
    };

    const records: T[] = await this.model.findAll(query);

    return records;
  }

  async getAllPaginated(
    whereQuery: WhereOptions<T>,
    queryOpts: ReqQueryOptions,
    includeables?: Includeable[],
    order?: OrderItem[],
    attributes?: FindAttributeOptions,
  ): Promise<PaginatedResponse<T>> {
    const { limit, offset } = queryOpts;

    const { rows: result, count: totalCount }: { rows: T[]; count: number } =
      await this.model.findAndCountAll({
        where: whereQuery,
        attributes,
        limit,
        offset,
        include: includeables,
        order: order ? order : [['createdAt', 'DESC']],
        distinct: true,
      });

    return { result, totalCount };
  }

  async get(
    whereQuery: WhereOptions<T>,
    includeables?: Includeable[],
    order?: OrderItem[],
    attributes?: FindAttributeOptions,
    group?: GroupOption,
    transaction?: Transaction,
  ): Promise<T> {
    const record: T | null = await this.model.findOne({
      where: whereQuery,
      include: includeables,
      attributes,
      group,
      order,
      transaction,
    });

    return record;
  }

  async count(whereQuery: WhereOptions<T>, includeables?: Includeable[]): Promise<number> {
    const count: number = await this.model.count({
      where: whereQuery,
      include: includeables,
    });

    return count;
  }

  async getOrError(
    whereQuery: WhereOptions<T>,
    includeables?: Includeable[],
    attributes?: FindAttributeOptions,
  ): Promise<T> {
    const record: T | null = await this.model.findOne({
      where: whereQuery,
      include: includeables,
      attributes,
    });

    if (!record) {
      throw new NotFoundError(`This ${this.name.toLowerCase()} could not be found.`);
    }

    return record as T;
  }

  async getById(id: string, includeables?: Includeable[], transaction?: Transaction): Promise<T> {
    const record: T | null = await this.model.findByPk(id, {
      include: includeables,
      transaction,
    });

    return record;
  }

  async getByIdOrError(id: string, includeables?: Includeable[]): Promise<T> {
    const record: T | null = await this.model.findByPk(id, {
      include: includeables,
    });

    if (!record) {
      throw new NotFoundError(`This ${this.name.toLowerCase()} could not be found.`);
    }

    return record;
  }

  async delete(whereQuery: WhereOptions<T>, transaction?: Transaction): Promise<number> {
    const record = await this.model.destroy({ where: whereQuery, transaction });
    return record;
  }

  async deleteOrError(whereQuery: WhereOptions<T>, force: boolean = false): Promise<void> {
    const record = await this.model.destroy({ where: whereQuery, force });

    if (!record) {
      throw new NotFoundError(`This ${this.name.toLowerCase()} could not be found.`);
    }
  }

  async sum(fieldName: string, whereQuery: WhereOptions<T>): Promise<number> {
    const sumOfRecords = await this.model.sum(fieldName, {
      where: whereQuery,
    });

    return sumOfRecords ?? 0;
  }

  async validateField(
    whereQuery: WhereOptions<T>,
    fieldName: string = 'name',
    throwError: boolean = true,
  ): Promise<T> {
    const record: T | null = await this.model.findOne({
      where: whereQuery,
    });

    if (record && throwError) {
      throw new UnprocessableEntityError(
        `A ${this.name.toLowerCase()} with this ${fieldName} already exists.`,
      );
    }

    return record;
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  protected generateIncludeable<T extends Model>(
    model: ModelStatic<T>,
    alias: string,
    attributes?: string[],
    where?: WhereOptions<T>,
    includeables?: Includeable[],
    required?: boolean,
    order?: OrderItem[],
  ): Includeable {
    const include: Includeable = {
      model,
      as: alias,
      attributes,
      where,
      order,
      separate: order ? true : false,
      required,
      ...(includeables && { include: includeables }),
    };

    return include;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private validateWhereQuery(whereQuery: Record<string, any>): void {
    for (const [key, value] of Object.entries(whereQuery)) {
      if (value === undefined) {
        throw new BadRequestError(`Invalid where query: "${key}" is undefined.`);
      }

      if (/id$/i.test(key)) {
        // Convert value to number if it's not already a number
        const numValue = typeof value === 'number' ? value : Number(value);

        // Check if conversion is valid number and not NaN
        if (Number.isNaN(numValue)) {
          throw new BadRequestError(`You must be pass in a valid number for an id.`);
        }
      }
    }
  }
}

export default BaseService;
