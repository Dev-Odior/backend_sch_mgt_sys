import { Includeable, Model, ModelStatic } from 'sequelize';

export default class BaseService {
  constructor() {}

  protected generateIncludeable<T extends Model>(
    model: ModelStatic<T>,
    alias: string,
    attributes?: string[],
    include?: Includeable[],
  ): Includeable {
    return {
      model,
      as: alias,
      attributes,
      ...(include && { include }),
    };
  }
}
